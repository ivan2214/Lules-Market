import { Elysia, t } from "elysia";
import { AppError } from "@/server/errors";
import { authPlugin } from "@/server/plugins/auth";
import { AdminModel } from "./model";
import { AdminService } from "./service";

export const adminRouter = new Elysia({
  prefix: "/admin",
})
  .use(authPlugin)
  .post(
    "/createLog",
    async ({ body }) => {
      const log = await AdminService.createLog(body);
      return { success: true, log };
    },
    {
      isAdmin: true,
      body: AdminModel.createLogBody,
    },
  )
  .post(
    "/plans/createPlan",
    async ({ body }) => {
      return await AdminService.createPlan(body);
    },
    {
      isAdmin: true,
      body: AdminModel.createPlanBody,
    },
  )
  .post(
    "/deleteAllLogs",
    async () => {
      return await AdminService.deleteAllLogs();
    },
    {
      isAdmin: true,
    },
  )
  .get(
    "/dashboard/stats",
    async () => {
      const { stats } = await AdminService.getDashboardStats();
      return { stats };
    },
    {
      isAdmin: true,
      response: AdminModel.statsOutput,
    },
  )
  .get(
    "/dashboard/analytics",
    async () => {
      return await AdminService.getAnalyticsData();
    },
    {
      isAdmin: true,
      response: AdminModel.analyticsDataOutput,
    },
  )
  .get(
    "/plans",
    async () => {
      return await AdminService.getPlans();
    },
    {
      isAdmin: true,
      response: AdminModel.plansListOutput,
    },
  )
  .get(
    "/check-permission",
    async ({ body }) => {
      return await AdminService.checkPermission(body.adminId, body.permission);
    },
    {
      body: AdminModel.checkPermissionBody,
      response: t.Boolean(),
    },
  )
  .delete(
    "/business",
    async ({ body }) => {
      return await AdminService.deleteBusinessByIds(body.ids);
    },
    {
      isAdmin: true,
      body: AdminModel.deleteBusinessBody,
    },
  )
  .get(
    "/trials/get-trials-and-active-count",
    async () => {
      return await AdminService.getTrialsAndActiveCount();
    },
    {
      isAdmin: true,
    },
  )
  .post(
    "/trials/create-trial",
    async ({ body, user }) => {
      return await AdminService.createTrial({ ...body, adminId: user.id });
    },
    {
      isAdmin: true,
      body: AdminModel.createTrialBody,
    },
  )
  .get(
    "/me",
    async ({ user }) => {
      if (!user) throw new AppError("No autenticado", "UNAUTHORIZED");
      const admin = await AdminService.getCurrentAdmin(user.id);
      if (!admin) throw new AppError("No es admin", "FORBIDDEN");
      return admin;
    },
    {
      isAdmin: true,
    },
  );
