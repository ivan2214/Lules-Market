import "server-only";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import type { Image, Prisma } from "@/app/generated/prisma";
import type { ActionResult } from "@/hooks/use-action";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";
import { requireUser } from "../user/require-user";
import {
  type AnswerCreateInput,
  AnswerCreateSchema,
  type PostCreateInput,
  PostCreateSchema,
  type PostDTO,
} from "./post.dto";

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

export async function createPost(data: PostCreateInput): Promise<ActionResult> {
  const validated = PostCreateSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

  try {
    const user = await requireUser();

    // Ensure profile exists
    let profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.userId,
          name: user.name,
        },
      });
    }

    const images: Image[] = [];
    if (data?.images) {
      for (const image of data.images) {
        const newImage = await prisma.image.create({
          data: {
            key: image.key,
            url: image.url,
            name: image.name,
            size: image.size,
          },
        });
        images.push(newImage);
      }
    }

    const post = await prisma.post.create({
      data: {
        content: data.content,
        isAnon: data.isAnon,
        isQuestion: data.isQuestion,
        authorId: user.userId,
        images: {
          connect: images.map((image) => ({ key: image.key })),
        },
      },
    });

    updateTag(CACHE_TAGS.PUBLIC_POSTS);
    updateTag(CACHE_TAGS.POSTS);

    return {
      successMessage: "Publicación creada exitosamente",
      data: post,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      errorMessage: "Error al crear la publicación",
    };
  }
}

export async function createAnswer(
  data: AnswerCreateInput,
): Promise<ActionResult> {
  const validated = AnswerCreateSchema.safeParse(data);
  if (!validated.success) {
    return {
      errorMessage: validated.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", "),
    };
  }

  try {
    const user = await requireUser();

    // Ensure profile exists
    let profile = await prisma.profile.findUnique({
      where: { userId: user.userId },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: user.userId,
          name: user.name,
        },
      });
    }

    const answer = await prisma.answer.create({
      data: {
        content: data.content,
        isAnon: data.isAnon,
        postId: data.postId,
        authorId: user.userId,
      },
    });

    updateTag(CACHE_TAGS.PUBLIC_POSTS);
    updateTag(CACHE_TAGS.POSTS);
    updateTag(`post-${data.postId}`);

    return {
      successMessage: "Respuesta enviada exitosamente",
      data: answer,
    };
  } catch (error) {
    console.error("Error creating answer:", error);
    return {
      errorMessage: "Error al enviar la respuesta",
    };
  }
}

export async function toggleBestAnswer(
  answerId: string,
  postId: string,
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return { errorMessage: "Publicación no encontrada" };
    }

    if (post.authorId !== user.userId) {
      return { errorMessage: "No tienes permiso para realizar esta acción" };
    }

    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
    });

    if (!answer) {
      return { errorMessage: "Respuesta no encontrada" };
    }

    // If marking as best, unmark any other best answer for this post
    if (!answer.isBest) {
      await prisma.answer.updateMany({
        where: { postId, isBest: true },
        data: { isBest: false },
      });
    }

    await prisma.answer.update({
      where: { id: answerId },
      data: { isBest: !answer.isBest },
    });

    updateTag(CACHE_TAGS.PUBLIC_POSTS);
    updateTag(CACHE_TAGS.POSTS);
    updateTag(`post-${postId}`);

    return {
      successMessage: "Estado de respuesta actualizado",
    };
  } catch (error) {
    console.error("Error toggling best answer:", error);
    return {
      errorMessage: "Error al actualizar el estado de la respuesta",
    };
  }
}
