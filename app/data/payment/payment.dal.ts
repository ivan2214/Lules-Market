import "server-only";

import { updateTag } from "next/cache";
import type { PlanType } from "@/app/generated/prisma";
import { env } from "@/env";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { paymentClient, preferenceClient } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits";
import { getCurrentBusiness } from "../business/require-busines";
import type { PaymentDTO, PaymentPreferenceResult } from "./payment.dto";

// ========================================
// FUNCIONES PRIVADAS (Requieren autenticación)
// ========================================

export async function createPaymentPreference(
  plan: PlanType,
): Promise<PaymentPreferenceResult> {
  const { currentBusiness } = await getCurrentBusiness();

  if (plan === "FREE") {
    return {
      preferenceId: null,
      initPoint: null,
      sandboxInitPoint: null,
    };
  }

  const planLimits = SUBSCRIPTION_LIMITS[plan];

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      amount: planLimits.price,
      currency: "ARS",
      status: "pending",
      plan,
      businessId: currentBusiness.id,
    },
  });

  // Create Mercado Pago preference
  const preference = await preferenceClient.create({
    body: {
      items: [
        {
          id: payment.id,
          title: `Plan ${plan} - Comercios Locales`,
          description: `Suscripción mensual al plan ${plan}`,
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
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      mpPaymentId: preference.id,
    },
  });

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

  const updated = await prisma.currentPlan.update({
    where: { id: currentBusiness.id },
    data: {
      planType: plan,
      planStatus: "ACTIVE",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

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

  const updated = await prisma.currentPlan.update({
    where: { id: currentBusiness.id },
    data: {
      planStatus: "CANCELLED",
      expiresAt: new Date(),
    },
  });

  // Invalidar caché de business
  updateTag(CACHE_TAGS.BUSINESSES);
  updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
  updateTag(`business-${currentBusiness.id}`);

  return updated;
}

export async function getSubscriptionHistory() {
  const { currentBusiness } = await getCurrentBusiness();

  const payments = await prisma.payment.findMany({
    where: { businessId: currentBusiness.id },
    orderBy: { createdAt: "desc" },
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
      await prisma.payment.update({
        where: { id: paymentIdDB },
        data: {
          status: "rejected",
          mpStatus: status,
        },
      });
      return null;
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentIdDB },
      include: { business: true },
    });

    if (!payment) {
      throw new Error("Pago no encontrado");
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentIdDB },
      data: {
        status: "approved",
        mpStatus: status,
        paymentMethod: mpPayment.payment_method_id,
        amount: mpPayment.transaction_amount,
        currency: mpPayment.currency_id,
      },
    });

    // Update business plan
    await prisma.currentPlan.update({
      where: { id: payment.businessId },
      data: {
        planType: payment.plan,
        planStatus: "ACTIVE",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Actualiza métricas diarias
    const today = new Date().toISOString().slice(0, 10);
    await prisma.analytics.upsert({
      where: { date: today },
      update: {
        totalPayments: { increment: 1 },
        totalRevenue: { increment: mpPayment.transaction_amount },
      },
      create: {
        date: new Date(),
        totalPayments: 1,
        totalRevenue: mpPayment.transaction_amount,
      },
    });

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
  const payment = await prisma.payment.findUnique({
    where: { id: paymentIdDB },
  });

  if (!payment) {
    throw new Error("Pago no encontrado");
  }

  await prisma.payment.update({
    where: { id: paymentIdDB },
    data: {
      status: "rejected",
      mpStatus: "rejected",
    },
  });

  return payment;
}

export async function getPayment({
  paymentIdDB,
}: {
  paymentIdDB: string;
}): Promise<PaymentDTO | null> {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentIdDB },
      include: { business: true },
    });

    return payment;
  } catch (error) {
    console.error("Error getting payment:", error);
    throw error;
  }
}

export async function startTrial(plan: PlanType = "PREMIUM") {
  const { currentBusiness } = await getCurrentBusiness();

  // Verifica si ya tiene un trial activo
  const existingTrial = await prisma.trial.findUnique({
    where: { businessId: currentBusiness.id },
  });

  if (existingTrial?.isActive) throw new Error("Ya tenés un trial activo.");

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

  await prisma.trial.create({
    data: {
      businessId: currentBusiness.id,
      plan,
      expiresAt,
    },
  });

  await prisma.currentPlan.update({
    where: { id: currentBusiness.id },
    data: {
      planType: plan,
      planStatus: "ACTIVE",
      expiresAt: expiresAt,
    },
  });

  // Registrar en analíticas
  const today = new Date().toISOString().slice(0, 10);
  await prisma.analytics.upsert({
    where: { date: today },
    update: {
      totalTrials: { increment: 1 },
      activeTrials: { increment: 1 },
    },
    create: {
      date: new Date(),
      totalTrials: 1,
      activeTrials: 1,
    },
  });

  // Invalidar caché de business
  updateTag(CACHE_TAGS.BUSINESSES);
  updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
  updateTag(`business-${currentBusiness.id}`);

  return { message: "Trial iniciado con éxito", expiresAt };
}

export async function redeemCoupon(code: string) {
  const { currentBusiness } = await getCurrentBusiness();

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.active) throw new Error("Cupón inválido o expirado.");

  if (coupon.expiresAt && new Date() > coupon.expiresAt)
    throw new Error("El cupón ya expiró.");

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
    throw new Error("El cupón ya alcanzó su límite de usos.");

  const expiresAt = new Date(
    Date.now() + coupon.durationDays * 24 * 60 * 60 * 1000,
  );

  await prisma.couponRedemption.create({
    data: { couponId: coupon.id, businessId: currentBusiness.id },
  });

  await prisma.coupon.update({
    where: { id: coupon.id },
    data: { usedCount: { increment: 1 } },
  });

  await prisma.currentPlan.update({
    where: { id: currentBusiness.id },
    data: {
      planType: coupon.plan,
      planStatus: "ACTIVE",
      expiresAt: expiresAt,
    },
  });

  // Registrar en analíticas
  const today = new Date().toISOString().slice(0, 10);
  await prisma.analytics.upsert({
    where: { date: today },
    update: {
      totalRedemptions: { increment: 1 },
    },
    create: {
      date: new Date(),
      totalRedemptions: 1,
    },
  });

  // Invalidar caché de business
  updateTag(CACHE_TAGS.BUSINESSES);
  updateTag(CACHE_TAGS.PUBLIC_BUSINESSES);
  updateTag(`business-${currentBusiness.id}`);

  return { message: "Cupón aplicado correctamente", expiresAt };
}
