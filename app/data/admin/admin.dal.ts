"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db, type PlanType, schema } from "@/db";
import type { ActionResult } from "@/hooks/use-action";

export async function deleteAllLogs(
  _prevState: ActionResult,
): Promise<ActionResult> {
  try {
    await db.delete(schema.log);
    return { successMessage: "Logs eliminados exitosamente" };
  } catch (error) {
    console.error("Error deleting logs:", error);
    return { errorMessage: "Error al eliminar los logs" };
  } finally {
    updateTag("admin-logs");
  }
}

export async function createPlan(
  _prevState: ActionResult,
  data: {
    name: string;
    type: PlanType;
    description: string;
    price: number;
    discount: number;
    maxProducts: number;
    maxImages: number;
    features: string[];
    canFeatureProducts: boolean;
    hasStatistics: boolean;
    isActive: boolean;
  },
): Promise<ActionResult> {
  try {
    const alreadyExists = await db
      .select()
      .from(schema.plan)
      .where(eq(schema.plan.type, data.type))
      .limit(1);
    if (alreadyExists.length > 0) {
      return { errorMessage: "El plan ya existe" };
    }
    await db.insert(schema.plan).values({
      name: data.name,
      type: data.type,
      description: data.description,
      price: data.price,
      discount: data.discount,
      maxProducts: data.maxProducts,
      maxImages: data.maxImages,
      features: data.features,
      canFeatureProducts: data.canFeatureProducts,
      hasStatistics: data.hasStatistics,
      isActive: data.isActive,
    });

    return { successMessage: "Plan creado exitosamente" };
  } catch (error) {
    console.error("Error creating plan:", error);
    return { errorMessage: "Error al crear el plan" };
  } finally {
    updateTag("admin-plans");
  }
}
