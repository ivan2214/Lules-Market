"use server";

import { z } from "zod";

import { actionContext, oa } from "@/orpc/middlewares";

export const deleteAccountImage = oa
  .input(z.object({ key: z.string().min(1) }))
  .handler(async ({ input }) => {
    console.log(input.key);
  })
  .actionable({
    context: actionContext,
  });
