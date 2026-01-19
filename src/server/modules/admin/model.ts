import { t } from "elysia";
import { models } from "@/db/model";

export namespace AdminModel {
  export const ModifyUsageBody = t.Object({
    used: t.Object({
      productsUsed: t.Number(),
      imagesUsed: t.Number(),
    }),
  });

  export const ModifyUsageResponse = t.Object({
    success: t.Boolean(),
    message: t.String(),
  });

  export const TrendSchema = t.Object({
    percentage: t.Number(),
    isPositive: t.Boolean(),
  });

  export const TrendSchemaString = t.Union([
    t.Literal("up"),
    t.Literal("down"),
    t.Literal("stable"),
  ]);

  export const DashboardStatsSchema = t.Object({
    businesses: t.Object({
      total: t.Number(),
      active: t.Number(),
      banned: t.Number(),
      trend: TrendSchema,
    }),
    products: t.Object({
      total: t.Number(),
      active: t.Number(),
      banned: t.Number(),
      trend: TrendSchema,
    }),
    payments: t.Object({
      approved: t.Number(),
      pending: t.Number(),
      rejected: t.Number(),
      totalRevenue: t.Object({
        total: t.Number(),
        trend: TrendSchema,
      }),
    }),
    trials: t.Object({
      actives: t.Number(),
    }),
  });

  export const RevenuePointSchema = t.Object({
    month: t.String(),
    revenue: t.Number(),
  });

  export const GrowthPointSchema = t.Object({
    month: t.String(),
    count: t.Number(),
  });

  export const MonthlyRevenueSchema = t.Object({
    data: t.Array(RevenuePointSchema),
    trend: TrendSchemaString,
    percentage: t.Number(),
  });

  export const BusinessGrowthSchema = t.Object({
    data: t.Array(GrowthPointSchema),
    trend: TrendSchemaString,
    percentage: t.Number(),
  });

  export const PlanValueSchema = t.Object({
    value: t.Number(),
    percentage: t.Number(),
  });

  export const PlanDistributionSchema = t.Object({
    FREE: PlanValueSchema,
    BASIC: PlanValueSchema,
    PREMIUM: PlanValueSchema,
  });

  // Payloads
  export const createLogBody = t.Object(models.insert.log);
  export const createPlanBody = t.Object(models.insert.plan);
  export const deleteBusinessBody = t.Object({
    ids: t.Array(t.String()),
  });
  export const checkPermissionBody = t.Object({
    permission: t.Union([
      t.Literal("ALL"),
      t.Literal("BAN_USERS"),
      t.Literal("MANAGE_PLANS"),
      t.Literal("MANAGE_PAYMENTS"),
      t.Literal("MODERATE_CONTENT"),
      t.Literal("VIEW_ANALYTICS"),
    ]),
    adminId: t.String(),
  });
  export const createTrialBody = t.Object({
    businessId: t.String(),
    planType: t.Union([
      t.Literal("FREE"),
      t.Literal("BASIC"),
      t.Literal("PREMIUM"),
    ]),
    endDate: t.Date(),
  });

  // Pagination params
  export const paginationQuery = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1 })),
    perPage: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
  });

  // Entity IDs
  export const idParam = t.Object({
    id: t.String(),
  });

  // Filters
  export const logsFilterQuery = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1 })),
    perPage: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
    entityType: t.Optional(t.String()),
    action: t.Optional(t.String()),
  });

  export const paymentsFilterQuery = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1 })),
    perPage: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
    status: t.Optional(t.String()),
  });

  export const productsFilterQuery = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1 })),
    perPage: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
    active: t.Optional(t.BooleanString()),
    businessId: t.Optional(t.String()),
  });

  export const businessFilterQuery = t.Object({
    page: t.Optional(t.Numeric({ minimum: 1 })),
    perPage: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
    status: t.Optional(t.String()),
  });

  // Trial extension
  export const extendTrialBody = t.Object({
    newEndDate: t.Date(),
  });

  // Outputs
  export const analyticsDataOutput = t.Object({
    planDistribution: PlanDistributionSchema,
    monthlyData: MonthlyRevenueSchema,
    businessGrowthData: BusinessGrowthSchema,
  });

  export const statsOutput = t.Object({
    stats: DashboardStatsSchema,
  });

  export const plansListOutput = t.Array(t.Object(models.select.plan));

  export const successResponse = t.Object({
    success: t.Boolean(),
    message: t.String(),
  });
}
