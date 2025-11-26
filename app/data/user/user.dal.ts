import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";
import type { PostDTO } from "../post/post.dto";

export interface PublicProfileDTO {
  userId: string;
  name: string;
  avatar: {
    url: string;
  } | null;
  createdAt: Date;
  posts: PostDTO[];
}

export async function getPublicProfile(
  userId: string,
): Promise<PublicProfileDTO | null> {
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
        },
      },
    },
  });

  if (!user || !user.profile) {
    return null;
  }

  return {
    userId: user.id,
    name: user.profile.name,
    avatar: user.profile.avatar ? { url: user.profile.avatar.url } : null,
    createdAt: user.createdAt,
    posts: user.profile.posts as PostDTO[],
  };
}
