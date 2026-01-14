import "server-only";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type { PlanType } from "@/db/types";
import { env } from "@/env/server";
import { paymentClient, preferenceClient } from "@/lib/mercadopago";
import { AppError } from "@/server/errors";
import { PlanService } from "../plan/service";

// Local helper
async function getBusinessForUser(userId: string) {
  const currentBusiness = await db.query.business.findFirst({
    where: eq(schema.business.userId, userId),
  });

  if (!currentBusiness) {
    throw new AppError("No tienes un comercio activo", "BAD_REQUEST");
  }
  return currentBusiness;
}

export const PaymentService = {
  async getPlan(planType: PlanType) {
    return await PlanService.getByType(planType);
  },

  async createPreference(userId: string, planType: PlanType) {
    const currentBusiness = await getBusinessForUser(userId);

    if (planType === "FREE") {
      return {
        preferenceId: null,
        initPoint: null,
        sandboxInitPoint: null,
      };
    }

    const planLimits = await PlanService.getByType(planType);

    if (!planLimits) {
      return {
        preferenceId: null,
        initPoint: null,
        sandboxInitPoint: null,
      };
    }

    const [payment] = await db
      .insert(schema.payment)
      .values({
        amount: planLimits.price,
        currency: "ARS",
        status: "pending",
        plan: planType,
        businessId: currentBusiness.id,
      })
      .returning();

    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: payment.id,
            title: `Plan ${planType} - Comercios Locales`,
            description: `Suscripción mensual al plan ${planType}`,
            quantity: 1,
            unit_price: 1 || planLimits.price, // Keep original logic
            currency_id: "ARS",
          },
        ],
        metadata: {
          businessId: currentBusiness.id,
          paymentId: payment.id,
        },
        back_urls: {
          success: `${env.APP_URL}/dashboard/subscription/success`,
          failure: `${env.APP_URL}/dashboard/subscription/failure`,
          pending: `${env.APP_URL}/dashboard/subscription/pending`,
        },
        external_reference: payment.id,
        notification_url: `${env.APP_URL}/api/webhooks/mercadopago`,
        statement_descriptor: "COMERCIOS LOCALES",
        expiration_date_from: undefined,
      },
    });

    await db
      .update(schema.payment)
      .set({ mpPaymentId: preference.id })
      .where(eq(schema.payment.id, payment.id));

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    };
  },

  async upgrade(userId: string, planType: "FREE" | "BASIC" | "PREMIUM") {
    const currentBusiness = await getBusinessForUser(userId);

    const [updated] = await db
      .update(schema.currentPlan)
      .set({
        planType: planType,
        planStatus: "ACTIVE",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
      .where(eq(schema.currentPlan.id, currentBusiness.id))
      .returning();

    revalidatePath(`/comercio/${currentBusiness.id}`);

    return { updated };
  },

  async cancel(userId: string) {
    const currentBusiness = await getBusinessForUser(userId);

    const [updated] = await db
      .update(schema.currentPlan)
      .set({
        planStatus: "CANCELLED",
        expiresAt: new Date(),
      })
      .where(eq(schema.currentPlan.id, currentBusiness.id))
      .returning();

    revalidatePath(`/comercio/${currentBusiness.id}`);

    return updated;
  },

  async history(userId: string) {
    const currentBusiness = await getBusinessForUser(userId);

    const payments = await db.query.payment.findMany({
      where: eq(schema.payment.businessId, currentBusiness.id),
      orderBy: (payment, { desc }) => [desc(payment.createdAt)],
    });

    return payments;
  },

  async startTrial(
    userId: string,
    planType: "FREE" | "BASIC" | "PREMIUM" = "PREMIUM",
  ) {
    const currentBusiness = await getBusinessForUser(userId);

    const existingTrial = await db.query.trial.findFirst({
      where: eq(schema.trial.businessId, currentBusiness.id),
    });

    if (existingTrial?.isActive) {
      throw new AppError("Ya tenés un trial activo.", "BAD_REQUEST");
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    await db.insert(schema.trial).values({
      businessId: currentBusiness.id,
      plan: planType,
      expiresAt,
    });

    await db
      .update(schema.currentPlan)
      .set({
        planType,
        planStatus: "ACTIVE",
        expiresAt: expiresAt,
      })
      .where(eq(schema.currentPlan.id, currentBusiness.id));

    // Registrar en analíticas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingAnalytics = await db.query.analytics.findFirst({
      where: eq(schema.analytics.date, today),
    });

    if (existingAnalytics) {
      await db
        .update(schema.analytics)
        .set({
          totalTrials: (existingAnalytics.totalTrials ?? 0) + 1,
          activeTrials: (existingAnalytics.activeTrials ?? 0) + 1,
        })
        .where(eq(schema.analytics.date, today));
    } else {
      await db.insert(schema.analytics).values({
        date: today,
        totalTrials: 1,
        activeTrials: 1,
      });
    }

    revalidatePath(`/comercio/${currentBusiness.id}`);

    return { message: "Trial iniciado con éxito", expiresAt };
  },

  async failure(paymentIdDB: string) {
    const payment = await db.query.payment.findFirst({
      where: eq(schema.payment.id, paymentIdDB),
    });

    if (!payment) {
      throw new AppError("Pago no encontrado", "BAD_REQUEST");
    }

    await db
      .update(schema.payment)
      .set({
        status: "rejected",
        mpStatus: "rejected",
      })
      .where(eq(schema.payment.id, paymentIdDB));

    return { success: true };
  },

  async getPayment(paymentIdDB: string) {
    const payment = await db.query.payment.findFirst({
      where: eq(schema.payment.id, paymentIdDB),
      with: { business: true },
    });

    return { payment: payment ? payment : undefined };
  },

  async success(paymentIdMP: string, paymentIdDB: string) {
    try {
      const mpPayment = await paymentClient.get({
        id: paymentIdMP,
      });

      if (!mpPayment) {
        throw new AppError("Pago no encontrado en Mercado Pago", "BAD_REQUEST");
      }

      const status = mpPayment.status;

      if (status !== "approved") {
        await db
          .update(schema.payment)
          .set({
            status: "rejected",
            mpStatus: status,
          })
          .where(eq(schema.payment.id, paymentIdDB));
        return null;
      }

      const payment = await db.query.payment.findFirst({
        where: eq(schema.payment.id, paymentIdDB),
        with: { business: true },
      });

      if (!payment) {
        throw new AppError("Pago no encontrado", "BAD_REQUEST");
      }

      await db
        .update(schema.payment)
        .set({
          status: "approved",
          mpStatus: status,
          paymentMethod: mpPayment.payment_method_id,
          amount: mpPayment.transaction_amount,
          currency: mpPayment.currency_id,
        })
        .where(eq(schema.payment.id, paymentIdDB));

      await db
        .update(schema.currentPlan)
        .set({
          planType: payment.plan,
          planStatus: "ACTIVE",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .where(eq(schema.currentPlan.id, payment.businessId));

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existingAnalytics = await db.query.analytics.findFirst({
        where: eq(schema.analytics.date, today),
      });

      if (existingAnalytics) {
        await db
          .update(schema.analytics)
          .set({
            totalPayments: (existingAnalytics.totalPayments ?? 0) + 1,
            totalRevenue:
              (existingAnalytics.totalRevenue ?? 0) +
              (mpPayment.transaction_amount ?? 0),
          })
          .where(eq(schema.analytics.date, today));
      } else {
        await db.insert(schema.analytics).values({
          date: today,
          totalPayments: 1,
          totalRevenue: mpPayment.transaction_amount ?? 0,
        });
      }

      revalidatePath(`/comercio/${payment.businessId}`);

      return payment;
    } catch (error) {
      console.error("Error processing payment success:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error processing payment", "INTERNAL_SERVER_ERROR");
    }
  },
};
