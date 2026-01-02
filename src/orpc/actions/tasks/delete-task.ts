"use server";

import { onSuccess } from "@orpc/server";
import { revalidatePath } from "next/cache";
import { actionContext } from "@/orpc/middlewares";
import { tasksRouter } from "@/orpc/routers/tasks";

export const deleteTask = tasksRouter.delete.actionable({
  context: actionContext,
  interceptors: [
    onSuccess(async () => {
      revalidatePath("/home/tasks");
    }),
  ],
});
