import type { Plan } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export async function getAll(): Promise<Plan[]> {
  try {
    return await prisma.plan.findMany();
  } catch (error) {
    console.error("Error al obtener los planes:", error);
    return [];
  }
}
