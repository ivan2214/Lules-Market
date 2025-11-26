import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Prisma } from "@/app/generated/prisma";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";
import type { PostDTO } from "./post.dto";

export async function listAllPosts({
  limit,
  page,
  search,
  sort,
}: {
  search?: string;
  page: number;
  limit: number;
  sort?: "date_asc" | "date_desc";
}): Promise<{
  posts: PostDTO[];
  total: number;
  pages: number;
  currentPage: number;
}> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.PUBLIC_POSTS, CACHE_TAGS.POSTS);

  const where: Prisma.PostWhereInput = {
    ...(search && {
      content: { contains: search, mode: "insensitive" as const },
    }),
  };

  const orderBy: Prisma.PostOrderByWithRelationInput[] = [
    {
      images: {
        _count: "desc",
      },
    },
  ];

  if (sort === "date_asc") {
    orderBy.push({ createdAt: "asc" });
  } else {
    orderBy.push({ createdAt: "desc" });
  }

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
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
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({
      where,
    }),
  ]);

  return {
    posts,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}
