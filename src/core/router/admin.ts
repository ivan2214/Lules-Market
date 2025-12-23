import "server-only";
import { ORPCError, os } from "@orpc/server";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { admin, business, plan, log as schemaLog } from "@/db/schema";
import type { Log, LogInsert, Permission, Plan, PlanInsert } from "@/db/types";
import {
  getAdminDashboardStatsCache,
  getAnalyticsDataCache,
  getPlansCache,
} from "../cache-functions/admin";
import { adminAuthorized } from "./middlewares/authorized";

// ====================== 📘 Tipos auxiliares ======================

const TrendSchemaString = z.enum(["up", "down", "stable"]);

const TrendSchema = z.object({
  percentage: z.number(),
  isPositive: z.boolean(),
});

const DashboardStatsSchema = z.object({
  businesses: z.object({
    total: z.number(),
    active: z.number(),
    banned: z.number(),
    trend: TrendSchema,
  }),
  products: z.object({
    total: z.number(),
    active: z.number(),
    banned: z.number(),
    trend: TrendSchema,
  }),
  payments: z.object({
    approved: z.number(),
    pending: z.number(),
    rejected: z.number(),
    totalRevenue: z.object({
      total: z.number(),
      trend: TrendSchema,
    }),
  }),
  trials: z.object({
    actives: z.number(),
  }),
});

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
      const [newLog] = await db.insert(schemaLog).values(input).returning();
      return { success: true, log: newLog };
    } catch (error) {
      console.error("Error creating log:", error);
      return { success: false, error: "Failed to create log" };
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
      await db.insert(plan).values(input);
      return { successMessage: "Plan created successfully" };
    } catch (error) {
      console.error("Error creating plan:", error);
      return { errorMessage: "Failed to create plan" };
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

export const getAdminDashboardStats = adminAuthorized
  .route({
    method: "GET",
    path: "/admin/dashboard/stats",
    summary: "Get admin dashboard stats",
    description: "Get admin dashboard stats",
    tags: ["Admin"],
  })
  .output(
    z.object({
      stats: DashboardStatsSchema,
    }),
  )
  .handler(async () => {
    return getAdminDashboardStatsCache();
  });

const RevenuePointSchema = z.object({
  month: z.string(),
  revenue: z.number(),
});

const GrowthPointSchema = z.object({
  month: z.string(),
  count: z.number(),
});

const MonthlyRevenueSchema = z.object({
  data: z.array(RevenuePointSchema),
  trend: TrendSchemaString,
  percentage: z.number(),
});

const BusinessGrowthSchema = z.object({
  data: z.array(GrowthPointSchema),
  trend: TrendSchemaString,
  percentage: z.number(),
});

const PlanValueSchema = z.object({
  value: z.number(),
  percentage: z.number(),
});

const PlanDistributionSchema = z.object({
  FREE: PlanValueSchema,
  BASIC: PlanValueSchema,
  PREMIUM: PlanValueSchema,
});

export const getAnalyticsData = adminAuthorized
  .route({
    method: "GET",
    path: "/admin/dashboard/analytics",
    summary: "Get admin dashboard analytics data",
    description: "Get admin dashboard analytics data",
    tags: ["Admin"],
  })
  .output(
    z.object({
      planDistribution: PlanDistributionSchema,
      monthlyData: MonthlyRevenueSchema,
      businessGrowthData: BusinessGrowthSchema,
    }),
  )
  .handler(async () => {
    return getAnalyticsDataCache();
  });

export const getAllPlans = adminAuthorized
  .route({
    method: "GET",
    path: "/admin/plans",
    summary: "Get all plans",
    description: "Get all plans",
    tags: ["Admin"],
  })
  .output(z.array(z.custom<Plan>()))
  .handler(async () => {
    return getPlansCache();
  });

export const checkAdminPermission = os
  .route({
    method: "GET",
    path: "/admin/check-permission",
    summary: "Check admin permission",
    description: "Check admin permission",
    tags: ["Admin"],
  })
  .input(
    z.object({
      permission: z.custom<Permission>(),
      adminId: z.string(),
    }),
  )
  .handler(async ({ input: { permission, adminId } }) => {
    try {
      const adminDB = await db.query.admin.findFirst({
        where: eq(admin.userId, adminId),
        columns: { permissions: true },
      });

      // Asegura que exista el admin y que su lista de permisos incluya el permiso requerido.
      return (
        adminDB?.permissions?.includes("ALL") ||
        adminDB?.permissions?.includes(permission) ||
        false
      );
    } catch (error) {
      console.error("Error al verificar permisos del admin:", error);
      return false;
    }
  });

export const deleteBusinessByIds = adminAuthorized
  .route({
    method: "DELETE",
    path: "/admin/business/:id",
    summary: "Delete business by id",
    description: "Delete business by id",
    tags: ["Admin"],
  })
  .input(
    z.object({
      id: z.array(z.string()),
    }),
  )
  .output(
    z.object({
      success: z.boolean(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const businesFoundToBeDeleted = await db.query.business.findMany({
        where: inArray(business.id, input.id),
      });
      if (businesFoundToBeDeleted.length === 0) {
        throw new ORPCError("Business not found");
      }
      await db.delete(business).where(inArray(business.id, input.id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting business:", error);
      throw new ORPCError("Error deleting business");
    }
  });

export const adminRoute = {
  createLog,
  createPlan,
  deleteAllLogs,
  getAdminDashboardStats,
  getAnalyticsData,
  getAllPlans,
  checkAdminPermission,
  deleteBusinessByIds,
};
