import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { plan } from "@/db/schema";
import type { Plan, PlanType } from "@/db/types";

export async function getPlansCache(): Promise<Plan[]> {
  const plans = await db.query.plan.findMany();

  return plans;
}

export async function getPlanCache(planType: PlanType): Promise<Plan | null> {
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
