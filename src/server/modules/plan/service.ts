import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { plan } from "@/db/schema";
import type { Plan, PlanType } from "@/db/types";
import { CACHE_KEYS, CACHE_TTL, getCachedOrFetch } from "@/lib/cache";

// Local helper function to match private logic
async function fetchPlans(): Promise<Plan[] | null> {
  const plans = await db.query.plan.findMany();
  return plans;
}

export const PlanService = {
  async listAll(): Promise<Plan[] | null> {
    return getCachedOrFetch(CACHE_KEYS.PLANS_ALL, fetchPlans, CACHE_TTL.PLANS);
  },

  async getByType(planType: PlanType): Promise<Plan | null> {
    return getCachedOrFetch(
      CACHE_KEYS.plan(planType),
      async () => {
        try {
          const result = await db.query.plan.findFirst({
            where: eq(plan.type, planType),
          });
          return result ?? null;
        } catch (error) {
          console.error("Error al obtener el plan:", error);
          return null;
        }
      },
      CACHE_TTL.PLANS,
    );
  },
};
