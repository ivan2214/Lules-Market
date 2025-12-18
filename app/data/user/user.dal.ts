"use server";
import { eq } from "drizzle-orm";
import { cacheLife } from "next/cache";
import { db, schema } from "@/db";
import type { ProfileWithRelations } from "@/db/types";

export async function getPublicProfile(
  userId: string,
): Promise<ProfileWithRelations | null> {
  "use cache";
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

  return user.profile as ProfileWithRelations;
}
