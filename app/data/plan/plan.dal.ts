import { eq } from "drizzle-orm";
import { db, type Plan, type PlanType, schema } from "@/db";

export async function getAll(): Promise<Plan[]> {
  try {
    return await db.query.plan.findMany();
  } catch (error) {
    console.error("Error al obtener los planes:", error);
    return [];
  }
}

export async function getPlan(planType: PlanType): Promise<Plan | null> {
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
