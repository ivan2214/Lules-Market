import { eq } from "drizzle-orm";
import { z } from "zod";
import { plan, log as schemaLog } from "@/db/schema";
import type { Log, LogInsert, PlanInsert } from "@/db/types";
import { db } from "@/db/types";
import { adminAuthorized } from "./middlewares/authorized";

export const createLog = adminAuthorized
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

export const createPlan = adminAuthorized
  .route({
    method: "POST",
    path: "/admin/plans/createPlan",
    summary: "Create a new plan",
    description: "Create a new plan",
    tags: ["Admin"],
  })
  .input(z.custom<PlanInsert>())
  .output(
    z.object({
      errorMessage: z.string().optional(),
      successMessage: z.string().optional(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const alreadyExists = await db
        .select()
        .from(plan)
        .where(eq(plan.type, input.type))
        .limit(1);
      if (alreadyExists.length > 0) {
        return { errorMessage: "El plan ya existe" };
      }
      await db.insert(plan).values({
        name: input.name,
        type: input.type,
        description: input.description,
        price: input.price,
        discount: input.discount,
        maxProducts: input.maxProducts,
        maxImages: input.maxImages,
        features: input.features,
        canFeatureProducts: input.canFeatureProducts,
        hasStatistics: input.hasStatistics,
        isActive: input.isActive,
      });

      return { successMessage: "Plan creado exitosamente" };
    } catch (error) {
      console.error("Error creating plan:", error);
      return { errorMessage: "Error al crear el plan" };
    }
  });

export const deleteAllLogs = adminAuthorized
  .route({
    method: "POST",
    path: "/admin/deleteAllLogs",
    summary: "Delete all logs",
    description: "Delete all logs",
    tags: ["Admin"],
  })
  .output(
    z.object({
      successMessage: z.string().optional(),
      errorMessage: z.string().optional(),
    }),
  )
  .handler(async () => {
    try {
      await db.delete(schemaLog);
      return { successMessage: "Logs eliminados exitosamente" };
    } catch (error) {
      console.error("Error deleting logs:", error);
      return { errorMessage: "Error al eliminar los logs" };
    }
  });

export const adminRoute = {
  createLog,
  createPlan,
  deleteAllLogs,
};
