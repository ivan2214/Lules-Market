"use server";

import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db, type PlanType, schema } from "@/db";

interface ChangePlanParams {
  businessId: string;
  planType: PlanType;
  isTrial?: boolean; // true si se quiere activar un trial
  trialDays?: number; // duración del trial (default 30 días)
  planDurationDays?: number; // duración del plan pagado (default 30 días)
}

export const changePlan = async ({
  businessId,
  planType,
  isTrial = false,
  trialDays = 30,
  planDurationDays = 30,
}: ChangePlanParams): Promise<{ ok: boolean; message?: string }> => {
  try {
    // Buscamos el plan
    const plan = await db.query.plan.findFirst({
      where: eq(schema.plan.type, planType),
    });
    if (!plan) return { ok: false, message: "Plan no encontrado" };

    // Buscamos el negocio
    const business = await db.query.business.findFirst({
      where: eq(schema.business.id, businessId),
      with: { currentPlan: true, trial: true },
    });
    if (!business) return { ok: false, message: "Comercio no encontrado" };

    const now = new Date();

    if (isTrial) {
      // Solo se permite trial si el plan actual está activo
      if (business.currentPlan?.planStatus !== "ACTIVE") {
        return {
          ok: false,
          message:
            "El comercio no tiene un plan activo para convertir en trial",
        };
      }

      const expiresAt = addDays(now, trialDays);

      // Desactivar cualquier trial activo
      if (business.trial?.isActive) {
        await db
          .update(schema.trial)
          .set({ isActive: false })
          .where(eq(schema.trial.businessId, businessId));
      }

      // Crear nuevo trial
      await db.insert(schema.trial).values({
        businessId,
        plan: planType,
        activatedAt: now,
        expiresAt,
        isActive: true,
      });

      // Actualizar el plan actual del negocio
      await db
        .update(schema.currentPlan)
        .set({
          planType,
          planStatus: "ACTIVE",
          expiresAt,
        })
        .where(eq(schema.currentPlan.businessId, businessId));

      return { ok: true, message: "Trial activado correctamente" };
    }

    // Caso plan pagado / cambio normal de plan
    const expiresAt = addDays(now, planDurationDays);

    await db
      .update(schema.currentPlan)
      .set({
        planType,
        planStatus: "ACTIVE",
        expiresAt,
      })
      .where(eq(schema.currentPlan.businessId, businessId));

    return { ok: true, message: "Plan actualizado correctamente" };
  } catch (error) {
    return { ok: false, message: `Ocurrió un error: ${error}` };
  } finally {
    updateTag("business-page");
  }
};
