import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { plan } from "@/db/schema";
import type { Plan, PlanType } from "@/db/types";
import { CACHE_KEYS, CACHE_TTL, getCachedOrFetch } from "@/lib/cache";

export abstract class PlanService {
  private static async fetchPlans(): Promise<Plan[] | null> {
    const plans = await db.query.plan.findMany();
    return plans;
  }

  static async listAll(): Promise<Plan[] | null> {
    return getCachedOrFetch(
      CACHE_KEYS.PLANS_ALL,
      PlanService.fetchPlans,
      CACHE_TTL.PLANS,
    );
  }

  static async getByType(planType: PlanType): Promise<Plan | null> {
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
  }
}
