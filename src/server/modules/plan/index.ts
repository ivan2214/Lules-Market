import { Elysia } from "elysia";
import { PlanModel } from "./model";
import { PlanService } from "./service";

export const planModule = new Elysia({
  prefix: "/plan/public",
}).get(
  "/list-all",
  async () => {
    try {
      const plans = await PlanService.listAll();
      return plans ?? [];
    } catch {
      return [];
    }
  },
  {
    response: PlanModel.listAllOutput,
  },
);
