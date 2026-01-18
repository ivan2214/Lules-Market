import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
import { authPlugin } from "@/server/plugins/auth";
import { PlanModel } from "./model";
import { PlanService } from "./service";

export const planModule = new Elysia({
  prefix: "/plan",
})
  // Public routes (no auth required)
  .group("/public", (app) => app)
  // Admin routes (auth required)
  .use(authPlugin)
  .put(
    "/manage/:type",
    async ({ params, body, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await PlanService.updatePlan(params.type, body);
    },
    {
      isAdmin: true,
      params: PlanModel.planTypeParam,
      body: PlanModel.updatePlanBody,
    },
  )
  .patch(
    "/manage/:type/pause",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await PlanService.pausePlan(params.type);
    },
    {
      isAdmin: true,
      params: PlanModel.planTypeParam,
    },
  )
  .patch(
    "/manage/:type/reactivate",
    async ({ params, isAdmin, admin }) => {
      if (!isAdmin || !admin)
        throw new AppError("Unauthorized", "UNAUTHORIZED");

      return await PlanService.reactivatePlan(params.type);
    },
    {
      isAdmin: true,
      params: PlanModel.planTypeParam,
    },
  );
