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
    "/trials/create",
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

  // =====================
  // LOGS ENDPOINTS
  // =====================

  // =====================
  // PAYMENTS ENDPOINTS
  // =====================

  // =====================
  // USERS/ENTITIES ENDPOINTS
  // =====================

  .patch(
    "/entities/user/:id/ban",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.banUser(params.id, admin.userId);
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
    },
  )
  .patch(
    "/entities/user/:id/activate",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.activateUser(params.id, admin.userId);
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
    },
  )
  .patch(
    "/entities/business/:id/ban",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.banBusiness(params.id, admin.userId);
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
    },
  )
  .patch(
    "/entities/business/:id/activate",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.activateBusiness(params.id, admin.userId);
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
    },
  )

  // =====================
  // PRODUCTS MODERATION ENDPOINTS
  // =====================

  .patch(
    "/products/:id/ban",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.banProduct(params.id, admin.userId);
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
    },
  )
  .patch(
    "/products/:id/pause",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.pauseProduct(params.id, admin.userId);
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
    },
  )
  .patch(
    "/products/:id/activate",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.activateProduct(params.id, admin.userId);
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
    },
  )

  // =====================
  // BUSINESS LIST ENDPOINTS
  // =====================

  // =====================
  // TRIAL MANAGEMENT ENDPOINTS
  // =====================
  .patch(
    "/trials/:id/extend",
    async ({ params, body, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.extendTrial(
        params.id,
        body.newEndDate,
        admin.userId,
      );
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
      body: AdminModel.extendTrialBody,
    },
  )
  .patch(
    "/trials/:id/cancel",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await AdminService.cancelTrial(params.id, admin.userId);
    },
    {
      isAdmin: true,
      params: AdminModel.idParam,
    },
  );
