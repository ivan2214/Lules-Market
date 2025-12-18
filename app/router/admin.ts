import "server-only";
import { os } from "@orpc/server";
import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { and, count, eq, gte, lt, sum } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  admin,
  bannedBusiness,
  bannedProduct,
  business,
  currentPlan,
  payment,
  plan,
  product,
  log as schemaLog,
  trial,
} from "@/db/schema";
import type { Log, LogInsert, Permission, Plan, PlanInsert } from "@/db/types";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Analytics } from "@/types";
import { adminAuthorized } from "./middlewares/authorized";

// ====================== 📘 Tipos auxiliares ======================

interface Trend {
  percentage: number;
  isPositive: boolean;
}

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

const calcTrend = (current: number, prev: number): number => {
  if (prev === 0) return current > 0 ? 100 : 0;
  return ((current - prev) / prev) * 100;
};

const buildTrend = (current: number, prev: number): Trend => ({
  percentage: round(calcTrend(current, prev)),
  isPositive: current >= prev,
});

const round = (n: number, decimals = 2): number => {
  return Number.isFinite(n) ? +n.toFixed(decimals) : 0;
};

async function createLogCached(input: LogInsert) {
  "use cache";
  cacheTag(CACHE_TAGS.ADMIN.LOGS.CREATE_LOG);
  cacheLife({
    revalidate: 60 * 60,
    expire: 60 * 60 * 24,
  });
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
}

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
    return createLogCached(input);
  });

async function createPlanCached(input: PlanInsert) {
  "use cache";
  cacheTag(CACHE_TAGS.ADMIN.PLANS.CREATE_PLAN);
  cacheLife({
    revalidate: 60 * 60,
    expire: 60 * 60 * 24,
  });
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
}

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
    return createPlanCached(input);
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

async function getAdminDashboardStatsCached() {
  "use cache";
  cacheTag(CACHE_TAGS.ADMIN.DASHBOARD.STATS);
  cacheLife("seconds");

  const now = new Date();

  const startCurrentMonth = startOfMonth(now);
  const endCurrentMonth = addMonths(startCurrentMonth, 1);
  const startLastMonth = startOfMonth(subMonths(now, 1));
  const endLastMonth = startCurrentMonth;

  const [
    totalBusinessesResult,
    bannedBusinessesResult,
    bannedProductsResult,
    totalProductsResult,
    totalApprovedPaymentsResult,
    totalPendingPaymentsResult,
    totalRejectedPaymentsResult,
    trialsActivesResult,
    businessesCurrentMonthResult,
    productsCurrentMonthResult,
    paymentsCurrentMonthResult,
    businessesLastMonthResult,
    productsLastMonthResult,
    paymentsLastMonthResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(business),
    db
      .select({ count: count() })
      .from(business)
      .innerJoin(bannedBusiness, eq(business.id, bannedBusiness.businessId)),
    db
      .select({ count: count() })
      .from(product)
      .innerJoin(bannedProduct, eq(product.id, bannedProduct.productId)),
    db.select({ count: count() }).from(product),
    db
      .select({ count: count() })
      .from(payment)
      .where(eq(payment.status, "approved")),
    db
      .select({ count: count() })
      .from(payment)
      .where(eq(payment.status, "pending")),
    db
      .select({ count: count() })
      .from(payment)
      .where(eq(payment.status, "rejected")),
    db.select({ count: count() }).from(trial).where(eq(trial.isActive, true)),
    db
      .select({ count: count() })
      .from(business)
      .where(gte(business.createdAt, startCurrentMonth)),
    db
      .select({ count: count() })
      .from(product)
      .where(gte(product.createdAt, startCurrentMonth)),
    db
      .select({ total: sum(payment.amount) })
      .from(payment)
      .where(
        and(
          eq(payment.status, "approved"),
          gte(payment.createdAt, startCurrentMonth),
          lt(payment.createdAt, endCurrentMonth),
        ),
      ),
    db
      .select({ count: count() })
      .from(business)
      .where(
        and(
          gte(business.createdAt, startLastMonth),
          lt(business.createdAt, endLastMonth),
        ),
      ),
    db
      .select({ count: count() })
      .from(product)
      .where(
        and(
          gte(product.createdAt, startLastMonth),
          lt(product.createdAt, endLastMonth),
        ),
      ),
    db
      .select({ total: sum(payment.amount) })
      .from(payment)
      .where(
        and(
          eq(payment.status, "approved"),
          gte(payment.createdAt, startLastMonth),
          lt(payment.createdAt, endLastMonth),
        ),
      ),
  ]);

  const totalBusinesses = totalBusinessesResult[0]?.count ?? 0;
  const bannedBusinesses = bannedBusinessesResult[0]?.count ?? 0;
  const bannedProducts = bannedProductsResult[0]?.count ?? 0;
  const totalProducts = totalProductsResult[0]?.count ?? 0;
  const totalApprovedPayments = totalApprovedPaymentsResult[0]?.count ?? 0;
  const totalPendingPayments = totalPendingPaymentsResult[0]?.count ?? 0;
  const totalRejectedPayments = totalRejectedPaymentsResult[0]?.count ?? 0;
  const trialsActives = trialsActivesResult[0]?.count ?? 0;
  const businessesCurrentMonth = businessesCurrentMonthResult[0]?.count ?? 0;
  const productsCurrentMonth = productsCurrentMonthResult[0]?.count ?? 0;
  const businessesLastMonth = businessesLastMonthResult[0]?.count ?? 0;
  const productsLastMonth = productsLastMonthResult[0]?.count ?? 0;

  const currentRevenue = Number(paymentsCurrentMonthResult[0]?.total) || 0;
  const lastRevenue = Number(paymentsLastMonthResult[0]?.total) || 0;

  const stats = {
    businesses: {
      total: totalBusinesses,
      active: totalBusinesses - bannedBusinesses,
      banned: bannedBusinesses,
      trend: buildTrend(businessesCurrentMonth, businessesLastMonth),
    },
    products: {
      total: totalProducts,
      active: totalProducts - bannedProducts,
      banned: bannedProducts,
      trend: buildTrend(productsCurrentMonth, productsLastMonth),
    },
    payments: {
      approved: totalApprovedPayments,
      pending: totalPendingPayments,
      rejected: totalRejectedPayments,
      totalRevenue: {
        total: currentRevenue,
        trend: buildTrend(currentRevenue, lastRevenue),
      },
    },
    trials: { actives: trialsActives },
  };

  return { stats };
}

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
    return getAdminDashboardStatsCached();
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

async function getAnalyticsDataCached() {
  "use cache";
  cacheTag(CACHE_TAGS.ADMIN.DASHBOARD.ANALYTICS);
  cacheLife("seconds");

  // Count businesses by plan type
  const [freeResult, basicResult, premiumResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(business)
      .innerJoin(currentPlan, eq(business.id, currentPlan.businessId))
      .where(eq(currentPlan.planType, "FREE")),
    db
      .select({ count: count() })
      .from(business)
      .innerJoin(currentPlan, eq(business.id, currentPlan.businessId))
      .where(eq(currentPlan.planType, "BASIC")),
    db
      .select({ count: count() })
      .from(business)
      .innerJoin(currentPlan, eq(business.id, currentPlan.businessId))
      .where(eq(currentPlan.planType, "PREMIUM")),
  ]);

  const free = freeResult[0]?.count ?? 0;
  const basic = basicResult[0]?.count ?? 0;
  const premium = premiumResult[0]?.count ?? 0;

  const totalPlans = free + basic + premium || 1;
  const planDistribution: Analytics["planDistribution"] = {
    FREE: { value: free, percentage: round((free / totalPlans) * 100) },
    BASIC: { value: basic, percentage: round((basic / totalPlans) * 100) },
    PREMIUM: {
      value: premium,
      percentage: round((premium / totalPlans) * 100),
    },
  };

  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

  // Get payments for the last 6 months
  const monthlyPayments = await db
    .select({
      createdAt: payment.createdAt,
      amount: payment.amount,
    })
    .from(payment)
    .where(
      and(gte(payment.createdAt, sixMonthsAgo), eq(payment.status, "approved")),
    );

  // Get businesses created in the last 6 months
  const businessByMonth = await db
    .select({
      createdAt: business.createdAt,
    })
    .from(business)
    .where(gte(business.createdAt, sixMonthsAgo));

  // 🔹 Revenue mensual
  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM");
    const nextMonth = addMonths(date, 1);

    const revenue = monthlyPayments
      .filter((p) => p.createdAt >= date && p.createdAt < nextMonth && p.amount)
      .reduce((acc, p) => acc + Number(p.amount || 0), 0);

    return { month, revenue };
  });

  const last = monthlyRevenue.at(-1);
  const current = last ? last.revenue : 0;
  const previous = monthlyRevenue.at(-2)?.revenue ?? 0;

  const monthlyData: Analytics["monthlyRevenue"] = {
    data: monthlyRevenue,
    trend: current > previous ? "up" : current < previous ? "down" : "stable",
    percentage: round(calcTrend(current, previous)),
  };

  // 🔹 Crecimiento de negocios
  const businessGrowth = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM");
    const nextMonth = addMonths(date, 1);

    const count = businessByMonth.filter(
      (b) => b.createdAt >= date && b.createdAt < nextMonth,
    ).length;

    return { month, count };
  });

  const lastBusiness = businessGrowth.at(-1);
  const currentBusiness = lastBusiness ? lastBusiness.count : 0;
  const prevBusiness = businessGrowth.at(-2)?.count ?? 0;

  const businessGrowthData: Analytics["businessGrowth"] = {
    data: businessGrowth,
    trend:
      currentBusiness > prevBusiness
        ? "up"
        : currentBusiness < prevBusiness
          ? "down"
          : "stable",
    percentage: round(calcTrend(currentBusiness, prevBusiness)),
  };

  return {
    planDistribution,
    monthlyData,
    businessGrowthData,
  };
}

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
    return getAnalyticsDataCached();
  });

async function getPlansCached(): Promise<Plan[]> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.ADMIN.PLANS.GET_ALL);

  const plans = await db.query.plan.findMany();

  return plans;
}

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
    return getPlansCached();
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

export const adminRoute = {
  createLog,
  createPlan,
  deleteAllLogs,
  getAdminDashboardStats,
  getAnalyticsData,
  getAllPlans,
  checkAdminPermission,
};
