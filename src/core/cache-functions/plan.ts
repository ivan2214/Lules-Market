import "server-only";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { plan } from "@/db/schema";
import type { Plan, PlanType } from "@/db/types";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";

export async function getPlansCache(): Promise<Plan[]> {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.PLAN.GET_ALL);

  const plans = await db.query.plan.findMany();

  return plans;
}

export async function getPlanCache(planType: PlanType): Promise<Plan | null> {
  "use cache";
  cacheTag(CACHE_TAGS.PLAN.GET_BY_ID(planType));
  try {
    const result = await db.query.plan.findFirst({
      where: eq(plan.type, planType),
    });
    return result ?? null;
  } catch (error) {
    console.error("Error al obtener el plan:", error);
    return null;
  }
}
