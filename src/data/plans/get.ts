import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { PlanService } from "@/server/modules/plan/service";

export async function getPlans() {
  "use cache";
  cacheTag("plans");
  cacheLife("weeks");

  const plans = await PlanService.listAll();
  return plans || [];
}
