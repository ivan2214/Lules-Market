import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { PlanService } from "@/server/modules/plan/service";

export async function getAdminAllPlans() {
  "use cache";
  cacheTag("plans", "admin-plans");
  cacheLife("weeks");

  return await PlanService.listAll();
}
