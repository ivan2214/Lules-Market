"use server";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";
import type { ProfileDTO } from "../profile/profile.dto";

export async function getPublicProfile(
  userId: string,
): Promise<ProfileDTO | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`profile-${userId}`, CACHE_TAGS.PUBLIC_POSTS);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      userRole: "USER", // Only fetch normal users
    },
    include: {
      profile: {
        include: {
          avatar: true,
          posts: {
            where: {
              isAnon: false, // Don't show anonymous posts on profile
            },
            orderBy: {
              createdAt: "desc",
            },
            include: {
              author: {
                include: {
                  avatar: true,
                },
              },
              images: true,
              answers: {
                include: {
                  author: {
                    include: {
                      avatar: true,
                    },
                  },
                },
              },
            },
          },
          reviews: {
            where: {
              isHidden: false,
            },
            orderBy: {
              createdAt: "desc",
            },
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                  },
                },
              },
              business: {
                include: {
                  logo: true,
                },
              },
              author: {
                include: {
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.profile) {
    return null;
  }

  return user.profile;
}
