import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { authPlugin } from "@/server/plugins/auth";
import { AdminModel } from "./model";
import { AdminService } from "./service";

export const adminModule = new Elysia({
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
  );
