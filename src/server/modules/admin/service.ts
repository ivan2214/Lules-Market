import "server-only";
import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { and, count, desc, eq, gte, inArray, lt, sum } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
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
  user as userSchema,
} from "@/db/schema";
import type {
  LogInsert,
  Permission,
  PlanInsert,
  Trial,
  TrialWithRelations,
  UserRole,
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

async function createLog(input: LogInsert) {
  try {
    const [newLog] = await db.insert(schemaLog).values(input).returning();
    revalidateTag("admin-logs", "max");
    revalidateTag("admin-logs-count", "max");
    return newLog;
  } catch (error) {
    console.error("Error creating log:", error);
    throw new AppError("Failed to create log", "INTERNAL_SERVER_ERROR");
  }
}

export const AdminService = {
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
  },

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
  },

  async getPlans() {
    const plans = await db.query.plan.findMany();
    return plans;
  },

  async getTrialsAndActiveCount(): Promise<{
    trials: TrialWithRelations[];
    activeTrials: (Trial & { daysRemaining: number })[];
  }> {
    const now = new Date();

    const [trials, activeTrials] = await Promise.all([
      db.query.trial.findMany({
        with: {
          business: {
            with: {
              currentPlan: {
                with: {
                  plan: true,
                },
              },
            },
          },
        },
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
  },

  async getPaginatedUsers(options: {
    page: number;
    perPage: number;
    role?: UserRole;
  }) {
    const { page, perPage, role } = options;
    return await db.query.user.findMany({
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: desc(userSchema.createdAt),
      with: {
        sessions: true,
        accounts: true,
      },
      where: role ? eq(userSchema.role, role) : undefined,
    });
  },

  async getRecentUsers(limit = 5) {
    return await db.query.user.findMany({
      limit,
      offset: 0,
      orderBy: desc(userSchema.createdAt),
      with: {
        sessions: true,
        accounts: true,
      },
    });
  },

  async getTotalUsersCount() {
    const result = await db.select({ count: count() }).from(userSchema);
    return result[0]?.count ?? 0;
  },

  // --- MUTATIONS ---

  async createLog(input: LogInsert) {
    return createLog(input);
  },

  async createPlan(input: PlanInsert) {
    try {
      await db.insert(plan).values(input);
      return { successMessage: "Plan created successfully" };
    } catch (error) {
      console.error("Error creating plan:", error);
      throw new AppError("Failed to create plan", "INTERNAL_SERVER_ERROR");
    }
  },

  async deleteAllLogs() {
    try {
      await db.delete(schemaLog);
      return { successMessage: "Logs eliminados exitosamente" };
    } catch (error) {
      console.error("Error deleting logs:", error);
      throw new AppError("Error al eliminar los logs", "INTERNAL_SERVER_ERROR");
    }
  },

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
  },

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
  },

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
        throw new AppError("El negocio ya tiene un trial", "BAD_REQUEST");
      }

      // creamos el nuevo trial
      const [newTrial] = await db
        .insert(trial)
        .values({
          businessId,
          plan: planDB.type,
          isActive: true,
          expiresAt: endDate,
          activatedAt: new Date(),
        })
        .returning();

      await db
        .update(currentPlan)
        .set({
          activatedAt: new Date(),
          businessId: businessId,
          expiresAt: endDate,
          hasStatistics: planDB.hasStatistics,
          imagesUsed: 0,
          productsUsed: 0,
          isActive: true,
          listPriority: planDB.listPriority,
          planStatus: "ACTIVE",
          planType: planDB.type,
          isTrial: true,
        })
        .where(eq(currentPlan.businessId, businessId));

      // creamos log logic directly here
      await createLog({
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

      revalidateTag("trials", "max");
      revalidatePath("/dashboard/subscription");
      return { success: true };
    } catch (error) {
      console.error("Error creating trial:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("No se pudo crear el trial", "INTERNAL_SERVER_ERROR");
    }
  },

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
  },

  async modifyUsage(
    trialId: string,
    used: { productsUsed: number; imagesUsed: number },
    adminId: string,
  ) {
    try {
      const trialDB = await db.query.trial.findFirst({
        where: eq(trial.id, trialId),
      });
      if (!trialDB) throw new AppError("Trial not found", "NOT_FOUND");

      await db
        .update(currentPlan)
        .set({
          productsUsed: used.productsUsed,
          imagesUsed: used.imagesUsed,
        })
        .where(eq(currentPlan.businessId, trialDB.businessId));

      // creamos log logic directly here
      await createLog({
        businessId: trialDB.businessId,
        entityType: "PLAN",
        action: "MODIFY",
        entityId: trialDB.businessId,
        adminId,
        timestamp: new Date(),
        details: {
          productsUsed: used.productsUsed,
          imagesUsed: used.imagesUsed,
        },
      });

      revalidateTag("trials", "max");
      revalidateTag("admin", "max");
      revalidatePath("/dashboard/subscription");
      return { success: true };
    } catch (error) {
      console.error("Error modifying trial:", error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        "No se pudo modificar el trial",
        "INTERNAL_SERVER_ERROR",
      );
    }
  },

  // =====================
  // LOGS
  // =====================

  async getPaginatedLogs(options: {
    page: number;
    perPage: number;
    entityType?: string;
    action?: string;
  }) {
    const { page, perPage, entityType, action } = options;

    const conditions = [];
    if (entityType) conditions.push(eq(schemaLog.entityType, entityType));
    if (action) conditions.push(eq(schemaLog.action, action));

    return await db.query.log.findMany({
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: desc(schemaLog.timestamp),
      where: conditions.length > 0 ? and(...conditions) : undefined,
    });
  },

  async getLogsCount(filters?: { entityType?: string; action?: string }) {
    const conditions = [];
    if (filters?.entityType)
      conditions.push(eq(schemaLog.entityType, filters.entityType));
    if (filters?.action) conditions.push(eq(schemaLog.action, filters.action));

    const result = await db
      .select({ count: count() })
      .from(schemaLog)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    return result[0]?.count ?? 0;
  },

  // =====================
  // PAYMENTS (Read-only)
  // =====================

  async getPaginatedPayments(options: {
    page: number;
    perPage: number;
    status?: string;
  }) {
    const { page, perPage, status } = options;

    return await db.query.payment.findMany({
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: desc(payment.createdAt),
      where: status ? eq(payment.status, status) : undefined,
      with: {
        business: true,
      },
    });
  },

  async getPaymentsCount(status?: string) {
    const result = await db
      .select({ count: count() })
      .from(payment)
      .where(status ? eq(payment.status, status) : undefined);
    return result[0]?.count ?? 0;
  },

  // =====================
  // USER MODERATION
  // =====================

  async banUser(userId: string, adminId: string) {
    try {
      const userDB = await db.query.user.findFirst({
        where: eq(userSchema.id, userId),
      });

      if (!userDB) {
        throw new AppError("User not found", "NOT_FOUND");
      }

      // For now, we'll set role to a restricted state or use a banned field if available
      // Since the schema doesn't have a banned field, we'll create a log entry
      await createLog({
        adminId,
        entityType: "USER",
        action: "BAN",
        entityId: userId,
        timestamp: new Date(),
        details: { previousRole: userDB.role },
      });

      revalidateTag("users", "max");
      revalidateTag("entities", "max");
      return { success: true, message: "User banned successfully" };
    } catch (error) {
      console.error("Error banning user:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error banning user", "INTERNAL_SERVER_ERROR");
    }
  },

  async activateUser(userId: string, adminId: string) {
    try {
      const userDB = await db.query.user.findFirst({
        where: eq(userSchema.id, userId),
      });

      if (!userDB) {
        throw new AppError("User not found", "NOT_FOUND");
      }

      await createLog({
        adminId,
        entityType: "USER",
        action: "ACTIVATE",
        entityId: userId,
        timestamp: new Date(),
        details: { role: userDB.role },
      });

      revalidateTag("users", "max");
      revalidateTag("entities", "max");
      return { success: true, message: "User activated successfully" };
    } catch (error) {
      console.error("Error activating user:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error activating user", "INTERNAL_SERVER_ERROR");
    }
  },

  // =====================
  // BUSINESS MODERATION
  // =====================

  async banBusiness(businessId: string, adminId: string) {
    try {
      const businessDB = await db.query.business.findFirst({
        where: eq(business.id, businessId),
      });

      if (!businessDB) {
        throw new AppError("Business not found", "NOT_FOUND");
      }

      await db
        .update(business)
        .set({ status: "SUSPENDED", updatedAt: new Date() })
        .where(eq(business.id, businessId));

      await createLog({
        businessId,
        adminId,
        entityType: "BUSINESS",
        action: "BAN",
        entityId: businessId,
        timestamp: new Date(),
        details: { previousStatus: businessDB.status },
      });

      revalidateTag("businesses", "max");
      revalidateTag("entities", "max");
      return { success: true, message: "Business banned successfully" };
    } catch (error) {
      console.error("Error banning business:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error banning business", "INTERNAL_SERVER_ERROR");
    }
  },

  async activateBusiness(businessId: string, adminId: string) {
    try {
      const businessDB = await db.query.business.findFirst({
        where: eq(business.id, businessId),
      });

      if (!businessDB) {
        throw new AppError("Business not found", "NOT_FOUND");
      }

      await db
        .update(business)
        .set({ status: "ACTIVE", updatedAt: new Date() })
        .where(eq(business.id, businessId));

      await createLog({
        businessId,
        adminId,
        entityType: "BUSINESS",
        action: "ACTIVATE",
        entityId: businessId,
        timestamp: new Date(),
        details: { previousStatus: businessDB.status },
      });

      revalidateTag("businesses", "max");
      revalidateTag("entities", "max");
      return { success: true, message: "Business activated successfully" };
    } catch (error) {
      console.error("Error activating business:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error activating business", "INTERNAL_SERVER_ERROR");
    }
  },

  // =====================
  // PRODUCT MODERATION
  // =====================

  async getPaginatedProducts(options: {
    page: number;
    perPage: number;
    active?: boolean;
    businessId?: string;
  }) {
    const { page, perPage, active, businessId } = options;

    const conditions = [];
    if (active !== undefined) conditions.push(eq(product.active, active));
    if (businessId) conditions.push(eq(product.businessId, businessId));

    return await db.query.product.findMany({
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: desc(product.createdAt),
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        business: true,
        images: true,
      },
    });
  },

  async getProductsCount(filters?: { active?: boolean; businessId?: string }) {
    const conditions = [];
    if (filters?.active !== undefined)
      conditions.push(eq(product.active, filters.active));
    if (filters?.businessId)
      conditions.push(eq(product.businessId, filters.businessId));

    const result = await db
      .select({ count: count() })
      .from(product)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    return result[0]?.count ?? 0;
  },

  async banProduct(productId: string, adminId: string) {
    try {
      const productDB = await db.query.product.findFirst({
        where: eq(product.id, productId),
      });

      if (!productDB) {
        throw new AppError("Product not found", "NOT_FOUND");
      }

      await db
        .update(product)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(product.id, productId));

      await createLog({
        businessId: productDB.businessId,
        adminId,
        entityType: "PRODUCT",
        action: "BAN",
        entityId: productId,
        timestamp: new Date(),
        details: { productName: productDB.name },
      });

      revalidateTag("products", "max");
      return { success: true, message: "Product banned successfully" };
    } catch (error) {
      console.error("Error banning product:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error banning product", "INTERNAL_SERVER_ERROR");
    }
  },

  async pauseProduct(productId: string, adminId: string) {
    try {
      const productDB = await db.query.product.findFirst({
        where: eq(product.id, productId),
      });

      if (!productDB) {
        throw new AppError("Product not found", "NOT_FOUND");
      }

      await db
        .update(product)
        .set({ active: false, updatedAt: new Date() })
        .where(eq(product.id, productId));

      await createLog({
        businessId: productDB.businessId,
        adminId,
        entityType: "PRODUCT",
        action: "PAUSE",
        entityId: productId,
        timestamp: new Date(),
        details: { productName: productDB.name },
      });

      revalidateTag("products", "max");
      return { success: true, message: "Product paused successfully" };
    } catch (error) {
      console.error("Error pausing product:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error pausing product", "INTERNAL_SERVER_ERROR");
    }
  },

  async activateProduct(productId: string, adminId: string) {
    try {
      const productDB = await db.query.product.findFirst({
        where: eq(product.id, productId),
      });

      if (!productDB) {
        throw new AppError("Product not found", "NOT_FOUND");
      }

      await db
        .update(product)
        .set({ active: true, updatedAt: new Date() })
        .where(eq(product.id, productId));

      await createLog({
        businessId: productDB.businessId,
        adminId,
        entityType: "PRODUCT",
        action: "ACTIVATE",
        entityId: productId,
        timestamp: new Date(),
        details: { productName: productDB.name },
      });

      revalidateTag("products", "max");
      return { success: true, message: "Product activated successfully" };
    } catch (error) {
      console.error("Error activating product:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error activating product", "INTERNAL_SERVER_ERROR");
    }
  },

  // =====================
  // USERS WITH BUSINESS
  // =====================

  async getUsersWithBusiness(options: { page: number; perPage: number }) {
    const { page, perPage } = options;

    return await db.query.user.findMany({
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: desc(userSchema.createdAt),
      with: {
        business: {
          with: {
            currentPlan: {
              with: {
                plan: true,
              },
            },
          },
        },
      },
    });
  },

  async getUserById(userId: string) {
    return await db.query.user.findFirst({
      where: eq(userSchema.id, userId),
      with: {
        business: {
          with: {
            currentPlan: {
              with: {
                plan: true,
              },
            },
          },
        },
        sessions: true,
        accounts: true,
      },
    });
  },

  async getBusinessById(businessId: string) {
    return await db.query.business.findFirst({
      where: eq(business.id, businessId),
      with: {
        user: true,
        currentPlan: {
          with: {
            plan: true,
          },
        },
        products: true,
        trial: true,
      },
    });
  },

  // =====================
  // TRIAL MANAGEMENT (Extended)
  // =====================

  async extendTrial(trialId: string, newEndDate: Date, adminId: string) {
    try {
      const trialDB = await db.query.trial.findFirst({
        where: eq(trial.id, trialId),
      });

      if (!trialDB) {
        throw new AppError("Trial not found", "NOT_FOUND");
      }

      await db
        .update(trial)
        .set({ expiresAt: newEndDate, updatedAt: new Date() })
        .where(eq(trial.id, trialId));

      await db
        .update(currentPlan)
        .set({
          expiresAt: newEndDate,
          updatedAt: new Date(),
        })
        .where(eq(currentPlan.businessId, trialDB.businessId));

      await createLog({
        businessId: trialDB.businessId,
        adminId,
        entityType: "TRIAL",
        action: "EXTEND",
        entityId: trialId,
        timestamp: new Date(),
        details: {
          previousExpiresAt: trialDB.expiresAt,
          newExpiresAt: newEndDate,
        },
      });

      revalidateTag("trials", "max");
      return { success: true, message: "Trial extended successfully" };
    } catch (error) {
      console.error("Error extending trial:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error extending trial", "INTERNAL_SERVER_ERROR");
    }
  },

  async deleteTrial(trialId: string, adminId: string) {
    try {
      const trialDB = await db.query.trial.findFirst({
        where: eq(trial.id, trialId),
      });

      if (!trialDB) {
        throw new AppError("Trial not found", "NOT_FOUND");
      }

      await db.delete(trial).where(eq(trial.id, trialId));

      await createLog({
        businessId: trialDB.businessId,
        adminId,
        entityType: "TRIAL",
        action: "DELETE",
        entityId: trialId,
        timestamp: new Date(),
        details: {
          deletedAt: new Date(),
        },
      });

      revalidateTag("trials", "max");
      return { success: true, message: "Trial deleted successfully" };
    } catch (error) {
      console.error("Error deleting trial:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error deleting trial", "INTERNAL_SERVER_ERROR");
    }
  },

  // =====================
  // BUSINESSES LIST
  // =====================

  async getAllBusinesses(options: {
    page: number;
    perPage: number;
    status?: string;
  }) {
    const { page, perPage, status } = options;

    return await db.query.business.findMany({
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: desc(business.createdAt),
      where: status
        ? eq(
            business.status,
            status as "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION",
          )
        : undefined,
      with: {
        user: true,
        currentPlan: {
          with: {
            plan: true,
          },
        },
      },
    });
  },
};
