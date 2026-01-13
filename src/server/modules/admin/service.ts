import "server-only";
import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { and, count, eq, gte, inArray, lt, sum } from "drizzle-orm";
import { db } from "@/db";
import {
  admin,
  business,
  currentPlan,
  payment,
  plan,
  product,
  log as schemaLog,
  trial,
} from "@/db/schema";
import type {
  LogInsert,
  Permission,
  PlanInsert,
  Trial,
  TrialWithRelations,
} from "@/db/types";
import { AppError } from "@/server/errors";
import type { Analytics } from "@/shared/types";
import { calcTrend } from "@/shared/utils/calc-trend";

// Types embedded primarily for internal use if not exported from shared
interface Trend {
  percentage: number;
  isPositive: boolean;
}

const round = (n: number, decimals = 2): number => {
  return Number.isFinite(n) ? +n.toFixed(decimals) : 0;
};

const buildTrend = (current: number, prev: number): Trend => ({
  percentage: round(calcTrend(current, prev)),
  isPositive: current >= prev,
});

export class AdminService {
  // --- CACHED/READ HELPERS (originally in cache-functions) ---

  async getDashboardStats() {
    const now = new Date();

    const startCurrentMonth = startOfMonth(now);
    const endCurrentMonth = addMonths(startCurrentMonth, 1);
    const startLastMonth = startOfMonth(subMonths(now, 1));
    const endLastMonth = startCurrentMonth;

    const [
      totalBusinessesResult,
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
      activeBusinessesResult,
      suspendedBusinessesResult,
      activeProductsResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(business),

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
      db
        .select({ count: count() })
        .from(business)
        .where(eq(business.status, "ACTIVE")),
      db
        .select({ count: count() })
        .from(business)
        .where(eq(business.status, "SUSPENDED")),
      db
        .select({ count: count() })
        .from(product)
        .where(eq(product.active, true)),
    ]);

    const totalBusinesses = totalBusinessesResult[0]?.count ?? 0;
    const activeBusinesses = activeBusinessesResult[0]?.count ?? 0;
    const bannedBusinesses = suspendedBusinessesResult[0]?.count ?? 0;

    const totalProducts = totalProductsResult[0]?.count ?? 0;
    const activeProducts = activeProductsResult[0]?.count ?? 0;
    const bannedProducts = 0;

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
        active: activeBusinesses,
        banned: bannedBusinesses,
        trend: buildTrend(businessesCurrentMonth, businessesLastMonth),
      },
      products: {
        total: totalProducts,
        active: activeProducts,
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

  async getAnalyticsData() {
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
        and(
          gte(payment.createdAt, sixMonthsAgo),
          eq(payment.status, "approved"),
        ),
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
        .filter(
          (p) => p.createdAt >= date && p.createdAt < nextMonth && p.amount,
        )
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

  async getPlans() {
    const plans = await db.query.plan.findMany();
    return plans;
  }

  async getTrialsAndActiveCount(): Promise<{
    trials: TrialWithRelations[];
    activeTrials: (Trial & { daysRemaining: number })[];
  }> {
    const now = new Date();

    const [trials, activeTrials] = await Promise.all([
      db.query.trial.findMany({
        with: { business: true },
      }),
      db.query.trial.findMany({
        where: eq(trial.isActive, true),
      }),
    ]);

    const calculateDaysRemaining = (endDate: Date) => {
      const end = new Date(endDate);
      return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    };

    return {
      trials: trials.map((t) => ({
        ...t,
        daysRemaining: calculateDaysRemaining(t.expiresAt),
      })),
      activeTrials: activeTrials.map((t) => ({
        ...t,
        daysRemaining: calculateDaysRemaining(t.expiresAt),
      })),
    };
  }

  // --- MUTATIONS ---

  async createLog(input: LogInsert) {
    try {
      const [newLog] = await db.insert(schemaLog).values(input).returning();
      return newLog;
    } catch (error) {
      console.error("Error creating log:", error);
      throw new AppError("Failed to create log", "INTERNAL_SERVER_ERROR");
    }
  }

  async createPlan(input: PlanInsert) {
    try {
      await db.insert(plan).values(input);
      return { successMessage: "Plan created successfully" };
    } catch (error) {
      console.error("Error creating plan:", error);
      throw new AppError("Failed to create plan", "INTERNAL_SERVER_ERROR");
    }
  }

  async deleteAllLogs() {
    try {
      await db.delete(schemaLog);
      return { successMessage: "Logs eliminados exitosamente" };
    } catch (error) {
      console.error("Error deleting logs:", error);
      throw new AppError("Error al eliminar los logs", "INTERNAL_SERVER_ERROR");
    }
  }

  async checkPermission(adminId: string, permission: Permission) {
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

  async deleteBusinessByIds(ids: string[]) {
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

  async createTrial(input: {
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

      // creamos log logic directly here
      await this.createLog({
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

  async getCurrentAdmin(userId: string) {
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
}
