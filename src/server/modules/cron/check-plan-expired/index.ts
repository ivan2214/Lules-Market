import { Elysia } from "elysia";
import { env } from "@/env/server";
import { cronModel } from "./model";
import { PlanExpirationService } from "./service";

export const checkPlanExpiredCron = new Elysia({ prefix: "/api/cron" })
  .use(cronModel)
  .get(
    "/check-plan-expired",
    async ({ headers, set }) => {
      const authHeader = headers.authorization;

      if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const result =
        await PlanExpirationService.checkAndDeactivateExpiredPlans();

      if (!result.ok) {
        set.status = 500;
      }

      return result;
    },
    {
      response: {
        200: "cron.successResponse",
        401: "cron.errorResponse",
        500: "cron.errorResponse",
      },
    },
  );
