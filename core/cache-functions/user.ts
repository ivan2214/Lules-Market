import "server-only";

import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import type { ProfileWithRelations, User } from "@/db/types";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";

export async function getPublicProfileCached(
  userId: string,
): Promise<ProfileWithRelations | null> {
  "use cache";
  cacheTag(CACHE_TAGS.USER.GET_PUBLIC_PROFILE(userId));
  cacheLife("minutes");

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
  "use cache";
  cacheTag(CACHE_TAGS.USER.GET_BY_EMAIL(email));
  cacheLife("minutes");

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
  "use cache";
  cacheTag(CACHE_TAGS.USER.GET_BY_ID(id));
  cacheLife("minutes");

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
