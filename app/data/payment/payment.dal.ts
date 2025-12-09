import "server-only";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db, type PlanType, schema } from "@/db";
import { env } from "@/env";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { paymentClient, preferenceClient } from "@/lib/mercadopago";
import { getCurrentBusiness } from "../business/require-busines";
import { getPlan } from "../plan/plan.dal";
import type { PaymentDTO, PaymentPreferenceResult } from "./payment.dto";

// ========================================
// FUNCIONES PRIVADAS (Requieren autenticación)
// ========================================

export async function createPaymentPreference(
  planType: PlanType,
): Promise<PaymentPreferenceResult> {
  const { currentBusiness } = await getCurrentBusiness();

  if (planType === "FREE") {
    return {
      preferenceId: null,
      initPoint: null,
      sandboxInitPoint: null,
    };
  }

  const planLimits = await getPlan(planType);

  if (!planLimits) {
    return {
      preferenceId: null,
      initPoint: null,
      sandboxInitPoint: null,
    };
  }

  // Create payment record
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

  // Create Mercado Pago preference
  const preference = await preferenceClient.create({
    body: {
      items: [
        {
          id: payment.id,
          title: `Plan ${planType} - Comercios Locales`,
          description: `Suscripción mensual al plan ${planType}`,
          quantity: 1,
          unit_price: 1 || planLimits.price,
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

  // Update payment with preference ID
  await db
    .update(schema.payment)
    .set({ mpPaymentId: preference.id })
    .where(eq(schema.payment.id, payment.id));

  return {
    preferenceId: preference.id,
    initPoint: preference.init_point,
    sandboxInitPoint: preference.sandbox_init_point,
  };
}

export async function upgradePlan(plan: PlanType) {
  const { currentBusiness } = await getCurrentBusiness();

  if (currentBusiness?.currentPlan?.planType === plan) {
    throw new Error("Ya tienes este plan activo");
  }

  const [updated] = await db
    .update(schema.currentPlan)
    .set({
      planType: plan,
      planStatus: "ACTIVE",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    })
    .where(eq(schema.currentPlan.id, currentBusiness.id))
    .returning();

  // Invalidar caché de business
  updateTag(CACHE_TAGS.BUSINESSES);
  updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
  updateTag(`business-${currentBusiness.id}`);

  return updated;
}

export async function cancelSubscription() {
  const { currentBusiness } = await getCurrentBusiness();

  if (currentBusiness?.currentPlan?.planType === "FREE") {
    throw new Error("No tienes una suscripción activa");
  }

  const [updated] = await db
    .update(schema.currentPlan)
    .set({
      planStatus: "CANCELLED",
      expiresAt: new Date(),
    })
    .where(eq(schema.currentPlan.id, currentBusiness.id))
    .returning();

  // Invalidar caché de business
  updateTag(CACHE_TAGS.BUSINESSES);
  updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
  updateTag(`business-${currentBusiness.id}`);

  return updated;
}

export async function getSubscriptionHistory() {
  const { currentBusiness } = await getCurrentBusiness();

  const payments = await db.query.payment.findMany({
    where: eq(schema.payment.businessId, currentBusiness.id),
    orderBy: (payment, { desc }) => [desc(payment.createdAt)],
  });

  return payments;
}

export async function processPaymentSuccess({
  paymentIdMP,
  paymentIdDB,
}: {
  paymentIdMP: string;
  paymentIdDB: string;
}) {
  try {
    const mpPayment = await paymentClient.get({
      id: paymentIdMP,
    });

    if (!mpPayment) {
      throw new Error("Pago no encontrado en Mercado Pago");
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
      throw new Error("Pago no encontrado");
    }

    // Update payment status
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

    // Update business plan
    await db
      .update(schema.currentPlan)
      .set({
        planType: payment.plan,
        planStatus: "ACTIVE",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .where(eq(schema.currentPlan.id, payment.businessId));

    // Update daily analytics
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

    // Invalidar caché de business
    updateTag(CACHE_TAGS.BUSINESSES);
    updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
    updateTag(`business-${payment.businessId}`);

    return payment;
  } catch (error) {
    console.error("Error processing payment success:", error);
    throw error;
  }
}

export async function processPaymentFailure({
  paymentIdDB,
}: {
  paymentIdDB: string;
}) {
  const payment = await db.query.payment.findFirst({
    where: eq(schema.payment.id, paymentIdDB),
  });

  if (!payment) {
    throw new Error("Pago no encontrado");
  }

  await db
    .update(schema.payment)
    .set({
      status: "rejected",
      mpStatus: "rejected",
    })
    .where(eq(schema.payment.id, paymentIdDB));

  return payment;
}

export async function getPayment({
  paymentIdDB,
}: {
  paymentIdDB: string;
}): Promise<PaymentDTO | null> {
  try {
    const payment = await db.query.payment.findFirst({
      where: eq(schema.payment.id, paymentIdDB),
      with: { business: true },
    });

    return payment as PaymentDTO | null;
  } catch (error) {
    console.error("Error getting payment:", error);
    throw error;
  }
}

export async function startTrial(plan: PlanType = "PREMIUM") {
  const { currentBusiness } = await getCurrentBusiness();

  // Verifica si ya tiene un trial activo
  const existingTrial = await db.query.trial.findFirst({
    where: eq(schema.trial.businessId, currentBusiness.id),
  });

  if (existingTrial?.isActive) throw new Error("Ya tenés un trial activo.");

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

  await db.insert(schema.trial).values({
    businessId: currentBusiness.id,
    plan,
    expiresAt,
  });

  await db
    .update(schema.currentPlan)
    .set({
      planType: plan,
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

  // Invalidar caché de business
  updateTag(CACHE_TAGS.BUSINESSES);
  updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
  updateTag(`business-${currentBusiness.id}`);

  return { message: "Trial iniciado con éxito", expiresAt };
}
