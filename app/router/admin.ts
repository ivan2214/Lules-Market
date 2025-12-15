import { os } from "@orpc/server";
import { z } from "zod";
import * as dal from "@/app/data/admin/admin.dal";
import type { Log, LogInsert } from "@/db";

const LogInsertSchema = z.object({
  businessId: z.string(),
  adminId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  details: z.any(),
}) satisfies z.ZodType<LogInsert>;

const LogReturnSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  adminId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  details: z.any(),
  timestamp: z.date(),
}) satisfies z.ZodType<Log>;

export const createLog = os
  .route({
    method: "POST",
    path: "/admin/createLog",
    summary: "Create a new log",
    description: "Create a new log",
    tags: ["Admin"],
  })
  .input(LogInsertSchema)
  .output(
    z.object({
      success: z.boolean(),
      log: LogReturnSchema,
    }),
  )
  .handler(async ({ input }) => {
    const log = await dal.createLog(input);
    return { success: true, log };
  });
