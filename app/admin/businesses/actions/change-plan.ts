"use server";

import { os } from "@orpc/server";
import { addDays } from "date-fns";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

const ChangePlanInputSchema = z.object({
  businessId: z.string(),
  planType: z.enum(["FREE", "BASIC", "PREMIUM"]),
  isTrial: z.boolean().optional().default(false),
  trialDays: z.number().optional().default(30),
  planDurationDays: z.number().optional().default(30),
});

export const changePlan = os
  .input(ChangePlanInputSchema)
  .handler(async ({ input }) => {
    const {
      businessId,
      planType,
      isTrial = false,
      trialDays = 30,
      planDurationDays = 30,
    } = input;

    try {
      // Buscamos el plan
      const plan = await db.query.plan.findFirst({
        where: eq(schema.plan.type, planType),
      });
      if (!plan) throw new Error("Plan no encontrado");

      // Buscamos el negocio
      const business = await db.query.business.findFirst({
        where: eq(schema.business.id, businessId),
        with: { currentPlan: true, trial: true },
      });
      if (!business) throw new Error("Comercio no encontrado");

      const now = new Date();

      if (isTrial) {
        // Solo se permite trial si el plan actual está activo
        if (business.currentPlan?.planStatus !== "ACTIVE") {
          throw new Error(
            "El comercio no tiene un plan activo para convertir en trial",
          );
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

        updateTag(CACHE_TAGS.BUSINESS.GET_ALL);
        updateTag(CACHE_TAGS.BUSINESS.GET_BY_ID(businessId));

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

      updateTag(CACHE_TAGS.BUSINESS.GET_ALL);
      updateTag(CACHE_TAGS.BUSINESS.GET_BY_ID(businessId));

      return { ok: true, message: "Plan actualizado correctamente" };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Ocurrió un error: ${error}`);
    }
  })
  .actionable();
