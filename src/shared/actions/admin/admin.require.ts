import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, schema } from "@/db";
import { requireUser } from "@/shared/actions/user/require.user";

export const requireAdmin = cache(async () => {
  const session = await requireUser();

  const admin = await db.query.admin.findFirst({
    where: eq(schema.admin.userId, session.userId),
  });

  if (!admin) {
    redirect("/auth/signin");
  }

  return { session, admin };
});
