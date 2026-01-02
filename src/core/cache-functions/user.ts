import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type { ProfileWithRelations, User } from "@/db/types";

export async function getPublicProfileCached(
  userId: string,
): Promise<ProfileWithRelations | null> {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.id, userId),
    with: {
      profile: {
        with: {
          avatar: true,
        },
      },
    },
  });

  if (!user || !user.profile) {
    return null;
  }

  return user.profile;
}

export const getUserByEmailCached = async (
  email: string,
): Promise<User | null> => {
  try {
    const user = await db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });

    return user ?? null;
  } catch {
    return null;
  }
};

export const getUserByIdCached = async (
  id: string | undefined,
): Promise<User | null> => {
  try {
    if (!id) return null;
    const user = await db.query.user.findFirst({
      where: eq(schema.user.id, id),
    });

    return user ?? null;
  } catch {
    return null;
  }
};
