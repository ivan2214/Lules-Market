"use server";

import {
  createAnswer,
  createPost,
  toggleBestAnswer,
} from "@/app/data/post/post.dal";
import type {
  AnswerCreateInput,
  PostCreateInput,
} from "@/app/data/post/post.dto";
import type { ActionResult } from "@/hooks/use-action";

export async function createPublicPost(
  data: PostCreateInput,
): Promise<ActionResult> {
  return await createPost(data);
}

export async function createPublicAnswer(
  data: AnswerCreateInput,
): Promise<ActionResult> {
  return await createAnswer(data);
}

export async function togglePublicBestAnswer(
  answerId: string,
  postId: string,
): Promise<ActionResult> {
  return await toggleBestAnswer(answerId, postId);
}
