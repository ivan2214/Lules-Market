import { os } from "@orpc/server";
import { z } from "zod";
import { db, type Log, type LogInsert } from "@/db";
import { log as schemaLog } from "@/db/schema";

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
    try {
      const [log] = await db
        .insert(schemaLog)
        .values({
          businessId: input.businessId,
          adminId: input.adminId,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          details: input.details || {},
        })
        .returning();
      return { success: true, log };
    } catch (error) {
      console.error("Error creating log:", error);
      return { success: false, error: "Failed to create log." };
    }
  });
