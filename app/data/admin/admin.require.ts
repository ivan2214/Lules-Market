import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getCurrentUser, requireUser } from "@/app/data/user/require-user";
import { db, schema } from "@/db";

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

export const getCurrentAdmin = async () => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) return null;

    const admin = await db.query.admin.findFirst({
      where: eq(schema.admin.userId, user.id),
      with: {
        user: true,
      },
    });

    return admin ?? null;
  } catch {
    return null;
  }
};
