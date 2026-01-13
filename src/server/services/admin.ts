import "server-only";
import { eq, inArray } from "drizzle-orm";
import {
  getAdminDashboardStatsCache,
  getAnalyticsDataCache,
  getPlansCache,
  getTrialsAndActiveCountCache,
} from "@/core/cache-functions/admin";
import { db } from "@/db";
import { admin, business, plan, log as schemaLog, trial } from "@/db/schema";
import type { LogInsert, Permission, PlanInsert } from "@/db/types";
import { AppError } from "../errors";

// Helper para crear logs internamente si es necesario (sin pasar por API si se llama directo)
// Aunque en el original llamaba a client.admin.createLog, idealmente es una función del servicio.
export async function createLogService(input: LogInsert) {
  try {
    const [newLog] = await db.insert(schemaLog).values(input).returning();
    return newLog;
  } catch (error) {
    console.error("Error creating log:", error);
    throw new AppError("Failed to create log", "INTERNAL_SERVER_ERROR");
  }
}

export async function createPlanService(input: PlanInsert) {
  try {
    await db.insert(plan).values(input);
    return { successMessage: "Plan created successfully" };
  } catch (error) {
    console.error("Error creating plan:", error);
    throw new AppError("Failed to create plan", "INTERNAL_SERVER_ERROR");
  }
}

export async function deleteAllLogsService() {
  try {
    await db.delete(schemaLog);
    return { successMessage: "Logs eliminados exitosamente" };
  } catch (error) {
    console.error("Error deleting logs:", error);
    throw new AppError("Error al eliminar los logs", "INTERNAL_SERVER_ERROR");
  }
}

export async function getAdminDashboardStatsService() {
  return await getAdminDashboardStatsCache();
}

export async function getAnalyticsDataService() {
  return await getAnalyticsDataCache();
}

export async function getAllPlansService() {
  return await getPlansCache();
}

export async function checkAdminPermissionService(
  adminId: string,
  permission: Permission,
) {
  try {
    const adminDB = await db.query.admin.findFirst({
      where: eq(admin.userId, adminId),
      columns: { permissions: true },
    });

    return (
      adminDB?.permissions?.includes("ALL") ||
      adminDB?.permissions?.includes(permission) ||
      false
    );
  } catch (error) {
    console.error("Error al verificar permisos del admin:", error);
    return false;
  }
}

export async function deleteBusinessByIdsService(ids: string[]) {
  try {
    const businesFoundToBeDeleted = await db.query.business.findMany({
      where: inArray(business.id, ids),
    });
    if (businesFoundToBeDeleted.length === 0) {
      throw new AppError("Business not found", "NOT_FOUND");
    }
    await db.delete(business).where(inArray(business.id, ids));
    return { success: true };
  } catch (error) {
    console.error("Error deleting business:", error);
    if (error instanceof AppError) throw error;
    throw new AppError("Error deleting business", "INTERNAL_SERVER_ERROR");
  }
}

export async function getTrialsAndActiveCountService() {
  return await getTrialsAndActiveCountCache();
}

export async function createTrialService(input: {
  businessId: string;
  planType: "FREE" | "BASIC" | "PREMIUM";
  endDate: Date;
  adminId: string;
}) {
  try {
    const { businessId, planType, endDate, adminId } = input;
    const businessDB = await db.query.business.findFirst({
      where: eq(business.id, businessId),
    });
    if (!businessDB) {
      throw new AppError("Business not found", "NOT_FOUND");
    }
    const planDB = await db.query.plan.findFirst({
      where: eq(plan.type, planType),
    });
    if (!planDB) {
      throw new AppError("Plan not found", "NOT_FOUND");
    }
    // verificamos si ya tiene un trial
    const alreadyHasTrial = await db.query.trial.findFirst({
      where: eq(trial.businessId, businessId),
    });
    if (alreadyHasTrial) {
      throw new AppError("Business already has a trial", "BAD_REQUEST");
    }

    // creamos el nuevo trial
    const [newTrial] = await db
      .insert(trial)
      .values({
        businessId,
        plan: planType,
        isActive: true,
        expiresAt: endDate,
        activatedAt: new Date(),
      })
      .returning();

    // creamos log logic directly here instead of calling "client" to avoid circular dependency or external calls
    await createLogService({
      businessId,
      entityType: "TRIAL",
      action: "CREATE",
      entityId: newTrial.id,
      adminId: adminId,
      timestamp: new Date(),
      details: {
        planType,
        endDate,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating trial:", error);
    if (error instanceof AppError) throw error;
    throw new AppError("Error creating trial", "INTERNAL_SERVER_ERROR");
  }
}

export async function getCurrentAdminService(userId: string) {
  try {
    const adminDB = await db.query.admin.findFirst({
      where: eq(admin.userId, userId),
      with: {
        user: true,
      },
    });
    return adminDB ?? null;
  } catch (error) {
    console.error("Error getting current admin:", error);
    throw new AppError(
      "Error al obtener el administrador",
      "INTERNAL_SERVER_ERROR",
    );
  }
}
