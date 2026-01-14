import { and, eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { currentPlan } from "@/db/schema";
import type { CurrentPlan, CurrentPlanWithRelations } from "@/db/types";
import { env } from "@/env/server";
import { api } from "@/lib/eden";
import type { CronModel } from "./model";

type CronResponse = CronModel.SuccessResponse | CronModel.ErrorResponse;

export const PlanExpirationService = {
  /**
   * Verifica y desactiva planes expirados
   * Se ejecuta diariamente para mantener la integridad de los planes activos
   */
  async checkAndDeactivateExpiredPlans(): Promise<CronResponse> {
    try {
      const now = new Date();

      const expiredPlans = await this.findExpiredPlans(now);
      let deactivatedCount = 0;

      for (const plan of expiredPlans) {
        await this.deactivatePlan(plan);
        await this.sendExpirationEmail(plan);
        await this.logPlanExpiration(plan);
        deactivatedCount++;
      }

      console.log(
        `✅ Cron check-plan-expired: ${deactivatedCount} planes desactivados`,
      );

      return {
        ok: true,
        desactivados: deactivatedCount,
        message: `${deactivatedCount} planes expirados desactivados correctamente`,
      };
      // biome-ignore lint/suspicious/noExplicitAny: <missing>
    } catch (err: any) {
      console.error("❌ Error en cron check-plan-expired:", err);
      await this.logError(err);

      return {
        ok: false,
        error: err.message,
      };
    }
  },

  async findExpiredPlans(now: Date) {
    return await db.query.currentPlan.findMany({
      where: and(
        eq(currentPlan.isActive, true),
        lt(currentPlan.expiresAt, now),
      ),
      with: {
        business: {
          with: {
            user: true,
          },
        },
        plan: true,
      },
    });
  },

  async deactivatePlan(plan: CurrentPlan) {
    await db
      .update(currentPlan)
      .set({ isActive: false })
      .where(eq(currentPlan.id, plan.id));
  },

  async sendExpirationEmail(currentPlan: CurrentPlanWithRelations) {
    if (
      currentPlan.business?.user?.email &&
      currentPlan.plan &&
      currentPlan.expiresAt
    ) {
      const { sendEmail } = await import("@/lib/email");
      await sendEmail({
        to: currentPlan.business.user.email,
        subject: "Tu plan expiró en LulesMarket",
        description: `Tu plan "${currentPlan.plan.name}" ha expirado el ${currentPlan.expiresAt?.toLocaleString()}.`,
        buttonText: "Actualizar plan",
        buttonUrl: `${env.APP_URL}/dashboard/subscription`,
        title: "Plan expirado",
        userFirstname: currentPlan.business.name,
      });
    }
  },

  async logPlanExpiration(plan: CurrentPlanWithRelations) {
    await api.admin.createLog.post({
      adminId: "SYSTEM",
      action: "PLAN_EXPIRED",
      entityType: "PlanActive",
      entityId: plan.id,
      details: {
        businessName: plan.business?.name,
        businessId: plan.business?.id,
        planName: plan.plan?.name,
        planSlug: plan.plan?.type,
        expiresAt: plan.expiresAt,
      },
    });
  },

  async logError(err: Error) {
    await api.admin.createLog.post({
      adminId: "SYSTEM",
      action: "PLAN_EXPIRATION_CHECK_FAILED",
      details: { error: err.message },
    });
  },
};
