"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admin, user as userDrizzle } from "@/db/schema";
import type { User } from "@/db/types";
import { env } from "@/env/server";

export const syncUserRole = async (sessionUser: {
  id: string;
  email: string;
}): Promise<{ success: boolean }> => {
  const isAdmin = sessionUser.email === env.ADMIN_EMAIL;
  const isSuperAdmin = sessionUser.email === env.SUPER_ADMIN_EMAIL;

  let user: User | null | undefined = await db.query.user.findFirst({
    where: eq(userDrizzle.id, sessionUser.id),
  });

  if (!user) {
    const name = isAdmin ? env.ADMIN_NAME : env.SUPER_ADMIN_NAME;
    const [newUser] = await db
      .insert(userDrizzle)
      .values({
        id: sessionUser.id,
        name,
        email: sessionUser.email,
        role: isAdmin ? "ADMIN" : "SUPER_ADMIN",
        emailVerified: true,
      })
      .returning();
    user = newUser;
  }

  if (isAdmin || isSuperAdmin) {
    // --- Update user role ---
    await db
      .update(userDrizzle)
      .set({
        role: isAdmin ? "ADMIN" : "SUPER_ADMIN",
        emailVerified: true,
      })
      .where(eq(userDrizzle.id, user.id));

    // --- Check existing admin ---
    const existing = await db.query.admin.findFirst({
      where: eq(admin.userId, user.id),
    });

    if (!existing) {
      await db.insert(admin).values({
        userId: user.id,
        permissions: ["ALL"], // array directo
      });
    }
    return { success: true };
  }

  return { success: false };
};
