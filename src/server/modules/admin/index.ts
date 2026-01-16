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
    async ({ body, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await AdminService.createPlan(body);
    },
    {
      isAdmin: true,
      body: AdminModel.createPlanBody,
    },
  )
  .post(
    "/deleteAllLogs",
    async ({ isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await AdminService.deleteAllLogs();
    },
    {
      isAdmin: true,
    },
  )
  .get(
    "/dashboard/stats",
    async ({ isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
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
    async ({ isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await AdminService.getAnalyticsData();
    },
    {
      isAdmin: true,
      response: AdminModel.analyticsDataOutput,
    },
  )
  .get(
    "/plans",
    async ({ isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await AdminService.getPlans();
    },
    {
      isAdmin: true,
      response: AdminModel.plansListOutput,
    },
  )
  .get(
    "/check-permission",
    async ({ body, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await AdminService.checkPermission(body.adminId, body.permission);
    },
    {
      isAdmin: true,
      body: AdminModel.checkPermissionBody,
      response: t.Boolean({
        default: false,
      }),
    },
  )
  .delete(
    "/business",
    async ({ body, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await AdminService.deleteBusinessByIds(body.ids);
    },
    {
      isAdmin: true,
      body: AdminModel.deleteBusinessBody,
    },
  )
  .get(
    "/trials/get-trials-and-active-count",
    async ({ isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await AdminService.getTrialsAndActiveCount();
    },
    {
      isAdmin: true,
    },
  )
  .post(
    "/trials/create-trial",
    async ({ body, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await AdminService.createTrial({ ...body, adminId: admin.userId });
    },
    {
      isAdmin: true,
      body: AdminModel.createTrialBody,
    },
  )
  .get(
    "/me",
    async ({ isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      const adminMe = await AdminService.getCurrentAdmin(admin.userId);
      if (!admin) throw new AppError("No es admin", "FORBIDDEN");
      return adminMe;
    },
    {
      isAdmin: true,
    },
  );
