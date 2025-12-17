import "server-only";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { db, type Plan, type PlanType, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getAll(): Promise<Plan[]> {
  "use cache";
  cacheTag(CACHE_TAGS.PLAN.GET_ALL);
  try {
    return await db.query.plan.findMany();
  } catch (error) {
    console.error("Error al obtener los planes:", error);
    return [];
  }
}

export async function getPlan(planType: PlanType): Promise<Plan | null> {
  "use cache";
  cacheTag(CACHE_TAGS.PLAN.GET_BY_ID(planType));
  try {
    const result = await db.query.plan.findFirst({
      where: eq(schema.plan.type, planType),
    });
    return result ?? null;
  } catch (error) {
    console.error("Error al obtener el plan:", error);
    return null;
  }
}
