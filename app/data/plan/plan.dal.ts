import type { Plan, PlanType } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export async function getAll(): Promise<Plan[]> {
  try {
    return await prisma.plan.findMany();
  } catch (error) {
    console.error("Error al obtener los planes:", error);
    return [];
  }
}

export async function getPlan(planType: PlanType): Promise<Plan | null> {
  try {
    return await prisma.plan.findUnique({
      where: {
        type: planType,
      },
    });
  } catch (error) {
    console.error("Error al obtener el plan:", error);
    return null;
  }
}
