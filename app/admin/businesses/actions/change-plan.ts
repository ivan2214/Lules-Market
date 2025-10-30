"use server";

import { addDays } from "date-fns";
import { updateTag } from "next/cache";
import type { PlanType } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

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
    console.log(planType);
    const plans = await prisma.plan.findMany();
    console.log(plans);

    const plan = await prisma.plan.findUnique({
      where: { type: planType },
    });
    if (!plan) return { ok: false, message: "Plan no encontrado" };

    // Buscamos el negocio
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { trial: true },
    });
    if (!business) return { ok: false, message: "Comercio no encontrado" };

    const now = new Date();

    if (isTrial) {
      // Solo se permite trial si el plan actual está activo
      if (business.planStatus !== "ACTIVE") {
        return {
          ok: false,
          message:
            "El comercio no tiene un plan activo para convertir en trial",
        };
      }

      const expiresAt = addDays(now, trialDays);

      // Desactivar cualquier trial activo
      if (business.trial && business.trial.isActive) {
        await prisma.trial.update({
          where: { businessId },
          data: { isActive: false },
        });
      }

      // Crear nuevo trial
      await prisma.trial.create({
        data: {
          businessId,
          plan: planType, // el plan actual del trial
          activatedAt: now,
          expiresAt,
          isActive: true,
        },
      });

      // Actualizar el negocio
      await prisma.business.update({
        where: { id: businessId },
        data: {
          plan: planType,
          planStatus: "ACTIVE",
          planExpiresAt: expiresAt,
        },
      });

      return { ok: true, message: "Trial activado correctamente" };
    }

    // Caso plan pagado / cambio normal de plan
    const expiresAt = addDays(now, planDurationDays);

    await prisma.business.update({
      where: { id: businessId },
      data: {
        plan: planType,
        planStatus: "ACTIVE",
        planExpiresAt: expiresAt,
      },
    });

    return { ok: true, message: "Plan actualizado correctamente" };
  } catch (error) {
    return { ok: false, message: `Ocurrió un error: ${error}` };
  } finally {
    updateTag("business-page");
  }
};
