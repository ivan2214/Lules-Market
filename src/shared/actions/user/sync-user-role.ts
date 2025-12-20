"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admin, user as userDrizzle } from "@/db/schema";
import { env } from "@/env";

export const syncUserRole = async (sessionUser: {
  id: string;
  email: string;
}): Promise<{ success: boolean }> => {
  const isAdmin = sessionUser.email === env.ADMIN_EMAIL;
  const isSuperAdmin = sessionUser.email === env.SUPER_ADMIN_EMAIL;

  if (isAdmin || isSuperAdmin) {
    // --- Update user role ---

    await db
      .update(userDrizzle)
      .set({
        userRole: isAdmin ? "ADMIN" : "SUPER_ADMIN",
        emailVerified: true,
      })
      .where(eq(userDrizzle.id, sessionUser.id));

    // --- Check existing admin ---
    const existing = await db.query.admin.findFirst({
      where: eq(admin.userId, sessionUser.id),
    });

    if (!existing) {
      await db.insert(admin).values({
        userId: sessionUser.id,
        permissions: ["ALL"], // array directo
      });
    }
    return { success: true };
  }

  return { success: false };
};
