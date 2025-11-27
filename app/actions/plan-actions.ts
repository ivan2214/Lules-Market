import * as PlanDAL from "@/app/data/plan/plan.dal";

export async function getPlans() {
  return PlanDAL.getAll();
}
