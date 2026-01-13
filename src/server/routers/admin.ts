import Elysia, { t } from "elysia";
import { models } from "@/db/model";
import { AppError } from "../errors";
import { authPlugin } from "../plugins/auth";
import {
  checkAdminPermissionService,
  createLogService,
  createPlanService,
  createTrialService,
  deleteAllLogsService,
  deleteBusinessByIdsService,
  getAdminDashboardStatsService,
  getAllPlansService,
  getAnalyticsDataService,
  getCurrentAdminService,
  getTrialsAndActiveCountService,
} from "../services/admin";

// Schemas for Admin
const TrendSchema = t.Object({
  percentage: t.Number(),
  isPositive: t.Boolean(),
});

const TrendSchemaString = t.Union([
  t.Literal("up"),
  t.Literal("down"),
  t.Literal("stable"),
]);

const DashboardStatsSchema = t.Object({
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

const RevenuePointSchema = t.Object({
  month: t.String(),
  revenue: t.Number(),
});

const GrowthPointSchema = t.Object({
  month: t.String(),
  count: t.Number(),
});

const MonthlyRevenueSchema = t.Object({
  data: t.Array(RevenuePointSchema),
  trend: TrendSchemaString,
  percentage: t.Number(),
});

const BusinessGrowthSchema = t.Object({
  data: t.Array(GrowthPointSchema),
  trend: TrendSchemaString,
  percentage: t.Number(),
});

const PlanValueSchema = t.Object({
  value: t.Number(),
  percentage: t.Number(),
});

const PlanDistributionSchema = t.Object({
  FREE: PlanValueSchema,
  BASIC: PlanValueSchema,
  PREMIUM: PlanValueSchema,
});

export const adminRouter = new Elysia({
  prefix: "/admin",
})
  .use(authPlugin)
  .post(
    "/createLog",
    async ({ body }) => {
      const log = await createLogService(body);
      return { success: true, log };
    },
    {
      isAdmin: true,
      body: t.Object(models.insert.log),
    },
  )
  .post(
    "/plans/createPlan",
    async ({ body }) => {
      return await createPlanService(body);
    },
    {
      isAdmin: true,
      body: t.Object(models.insert.plan),
    },
  )
  .post(
    "/deleteAllLogs",
    async () => {
      return await deleteAllLogsService();
    },
    {
      isAdmin: true,
    },
  )
  .get(
    "/dashboard/stats",
    async () => {
      const { stats } = await getAdminDashboardStatsService();
      return { stats };
    },
    {
      isAdmin: true,
      response: t.Object({
        stats: DashboardStatsSchema,
      }),
    },
  )
  .get(
    "/dashboard/analytics",
    async () => {
      const data = await getAnalyticsDataService();
      return data; //
    },
    {
      isAdmin: true,
      response: t.Object({
        planDistribution: PlanDistributionSchema,
        monthlyData: MonthlyRevenueSchema,
        businessGrowthData: BusinessGrowthSchema,
      }),
    },
  )
  .get(
    "/plans",
    async () => {
      return await getAllPlansService();
    },
    {
      isAdmin: true,

      response: t.Array(t.Object(models.select.plan)),
    },
  )
  .get(
    "/check-permission",
    async ({ body }) => {
      const result = await checkAdminPermissionService(
        body.adminId,
        body.permission,
      );
      return result;
    },
    {
      body: t.Object({
        permission: t.Union([
          t.Literal("ALL"),
          t.Literal("BAN_USERS"),
          t.Literal("MANAGE_PLANS"),
          t.Literal("MANAGE_PAYMENTS"),
          t.Literal("MODERATE_CONTENT"),
          t.Literal("VIEW_ANALYTICS"),
        ]),
        adminId: t.String(),
      }),
      response: t.Boolean(),
    },
  )
  .delete(
    "/business",
    async ({ body }) => {
      return await deleteBusinessByIdsService(body.ids);
    },
    {
      isAdmin: true,
      path: "/business/delete",
      body: t.Object({
        ids: t.Array(t.String()),
      }),
    },
  )
  .get(
    "/trials/get-trials-and-active-count",
    async () => {
      return await getTrialsAndActiveCountService();
    },
    {
      isAdmin: true,
    },
  )
  .post(
    "/trials/create-trial",
    async ({ body, user }) => {
      return await createTrialService({ ...body, adminId: user.id });
    },
    {
      isAdmin: true,
      body: t.Object({
        businessId: t.String(),
        planType: t.Union([
          t.Literal("FREE"),
          t.Literal("BASIC"),
          t.Literal("PREMIUM"),
        ]),
        endDate: t.Date(), // Elysia handles Date in body if JSON is correct? Or string coerced.
      }),
    },
  )
  .get(
    "/me",
    async ({ user }) => {
      if (!user) throw new AppError("No autenticado", "UNAUTHORIZED");
      const admin = await getCurrentAdminService(user.id);
      if (!admin) throw new AppError("No es admin", "FORBIDDEN");
      return admin;
    },
    {
      detail: {
        summary: "Get current admin",
      },
      isAdmin: true,
    },
  );
