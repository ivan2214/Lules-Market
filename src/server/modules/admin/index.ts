import { Elysia, t } from "elysia";
import { AppError } from "@/server/errors";
import { authPlugin } from "@/server/plugins/auth";
import { AdminModel } from "./model";
import { AdminService } from "./service";

const adminService = new AdminService();

export const adminRouter = new Elysia({
  prefix: "/admin",
})
  .use(authPlugin)
  .post(
    "/createLog",
    async ({ body }) => {
      const log = await adminService.createLog(body);
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
      return await adminService.createPlan(body);
    },
    {
      isAdmin: true,
      body: AdminModel.createPlanBody,
    },
  )
  .post(
    "/deleteAllLogs",
    async () => {
      return await adminService.deleteAllLogs();
    },
    {
      isAdmin: true,
    },
  )
  .get(
    "/dashboard/stats",
    async () => {
      const { stats } = await adminService.getDashboardStats();
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
      return await adminService.getAnalyticsData();
    },
    {
      isAdmin: true,
      response: AdminModel.analyticsDataOutput,
    },
  )
  .get(
    "/plans",
    async () => {
      return await adminService.getPlans();
    },
    {
      isAdmin: true,
      response: AdminModel.plansListOutput,
    },
  )
  .get(
    "/check-permission",
    async ({ body }) => {
      return await adminService.checkPermission(body.adminId, body.permission);
    },
    {
      body: AdminModel.checkPermissionBody,
      response: t.Boolean(),
    },
  )
  .delete(
    "/business",
    async ({ body }) => {
      return await adminService.deleteBusinessByIds(body.ids);
    },
    {
      isAdmin: true,
      body: AdminModel.deleteBusinessBody,
    },
  )
  .get(
    "/trials/get-trials-and-active-count",
    async () => {
      return await adminService.getTrialsAndActiveCount();
    },
    {
      isAdmin: true,
    },
  )
  .post(
    "/trials/create-trial",
    async ({ body, user }) => {
      return await adminService.createTrial({ ...body, adminId: user.id });
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
      const admin = await adminService.getCurrentAdmin(user.id);
      if (!admin) throw new AppError("No es admin", "FORBIDDEN");
      return admin;
    },
    {
      isAdmin: true,
    },
  );
