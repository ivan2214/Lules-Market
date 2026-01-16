import { and, desc, eq, ilike, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { user as userSchema } from "@/db/schema";
import { UsersList } from "../_components/users-list";

const searchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).default(10),
  name: z.string().optional(),
  role: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase() : val),
    z.enum(["ADMIN", "USER", "SUPER_ADMIN", "BUSINESS"]).optional(),
  ),
  sort: z
    .string()
    .transform((val) => {
      try {
        return JSON.parse(val);
      } catch {
        return [{ id: "createdAt", desc: true }];
      }
    })
    .pipe(z.array(z.object({ id: z.string(), desc: z.boolean() })))
    .default([]),
});

type SearchParams = {
  page?: string;
  perPage?: string;
  name?: string;
  role?: string;
  sort?: string;
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const search = await searchParams;
  const {
    page,
    perPage,
    name,
    role,
    sort: _sort,
  } = searchSchema.parse(search || {});

  const where: SQL[] = [];

  if (name) {
    where.push(ilike(userSchema.name, `%${name}%`));
  }

  if (role) {
    where.push(eq(userSchema.role, role));
  }

  const data = await db.query.user.findMany({
    limit: perPage,
    offset: (page - 1) * perPage,
    orderBy: desc(userSchema.createdAt),
    where: and(...where),
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <UsersList data={data} pageCount={Math.ceil(data.length / perPage)} />
    </div>
  );
}
