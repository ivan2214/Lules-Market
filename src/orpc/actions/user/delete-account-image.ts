"use server";

import { z } from "zod";

import { actionContext, oa } from "@/orpc/middlewares";
import { deleteS3Object } from "../s3/delete-s3-object";

export const deleteAccountImage = oa
  .input(z.object({ key: z.string().min(1) }))
  .handler(async ({ input }) => {
    await deleteS3Object({
      key: input.key,
    });
  })
  .actionable({
    context: actionContext,
  });
