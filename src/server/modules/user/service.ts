import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admin, user, user as userDrizzle } from "@/db/schema";
import type { ProfileWithRelations, User } from "@/db/types";
import { env } from "@/env/server";

export const UserService = {
  // --- QUERIES ---

  async getPublicProfile(userId: string): Promise<ProfileWithRelations | null> {
    const userRow = await db.query.user.findFirst({
      where: eq(user.id, userId),
      with: {
        profile: {
          with: {
            avatar: true,
          },
        },
      },
    });

    if (!userRow || !userRow.profile) {
      return null;
    }

    return userRow.profile;
  },

  async getByEmail(email: string): Promise<User | null> {
    try {
      const userRow = await db.query.user.findFirst({
        where: eq(user.email, email),
      });

      return userRow ?? null;
    } catch {
      return null;
    }
  },

  async getById(id: string | undefined): Promise<User | null> {
    try {
      if (!id) return null;
      const userRow = await db.query.user.findFirst({
        where: eq(user.id, id),
      });

      return userRow ?? null;
    } catch {
      return null;
    }
  },

  // --- MUTATIONS ---

  async syncRole(sessionUser: {
    id: string;
    email: string;
  }): Promise<{ success: boolean }> {
    const isAdmin = sessionUser.email === env.ADMIN_EMAIL;
    const isSuperAdmin = sessionUser.email === env.SUPER_ADMIN_EMAIL;

    let userRow: User | null | undefined = await db.query.user.findFirst({
      where: eq(userDrizzle.id, sessionUser.id),
    });

    if (!userRow) {
      const name = isAdmin ? env.ADMIN_NAME : env.SUPER_ADMIN_NAME;
      const [newUser] = await db
        .insert(userDrizzle)
        .values({
          id: sessionUser.id,
          name,
          email: sessionUser.email,
          role: isAdmin || isSuperAdmin ? "ADMIN" : "USER",
          emailVerified: true,
        })
        .returning();

      userRow = newUser;
    }

    if (isAdmin || isSuperAdmin) {
      // --- Update user role ---
      await db
        .update(userDrizzle)
        .set({
          role: isAdmin ? "ADMIN" : "USER",
          emailVerified: true,
        })
        .where(eq(userDrizzle.id, userRow.id));

      // --- Check existing admin ---
      const existing = await db.query.admin.findFirst({
        where: eq(admin.userId, userRow.id),
      });

      if (!existing) {
        await db.insert(admin).values({
          userId: userRow.id,
          permissions: ["ALL"], // array directo
        });
      }
      return { success: true };
    }

    return { success: false };
  },
};
