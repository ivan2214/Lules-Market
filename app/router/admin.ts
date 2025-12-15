import { os } from "@orpc/server";
import { z } from "zod";
import * as dal from "@/app/data/admin/admin.dal";
import type { Log, LogInsert } from "@/db";

export const createLog = os
  .route({
    method: "POST",
    path: "/admin/createLog",
    summary: "Create a new log",
    description: "Create a new log",
    tags: ["Admin"],
  })
  .input(z.custom<LogInsert>())
  .output(
    z.object({
      success: z.boolean(),
      log: z.custom<Log>().optional(),
      error: z.string().optional(),
    }),
  )
  .handler(async ({ input }) => {
    const result = await dal.createLog(input);

    return result;
  });
