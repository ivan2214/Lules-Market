"use server";

import type { SubscriptionPlan } from "@/app/generated/prisma";
import { paymentClient, preferenceClient } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits";
import { requireBusiness } from "../data/business/require-busines";

export async function createPaymentPreference(plan: SubscriptionPlan) {
  const { business } = await requireBusiness();

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
      businessId: business.id,
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
        businessId: business.id,
        paymentId: payment.id,
      },
      back_urls: {
        success: `${process.env.APP_URL}/dashboard/subscription/success`,
        failure: `${process.env.APP_URL}/dashboard/subscription/failure`,
        pending: `${process.env.APP_URL}/dashboard/subscription/pending`,
      },
      external_reference: payment.id,
      notification_url: `${process.env.APP_URL}/api/webhooks/mercadopago`,
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

    if (mpPayment.status !== "approved") {
      await prisma.payment.update({
        where: { id: paymentIdDB },
        data: {
          status: "rejected",
          mpStatus: mpPayment.status,
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
        mpStatus: "approved",
        paymentMethod: mpPayment.payment_method_id,
        amount: mpPayment.transaction_amount,
        currency: mpPayment.currency_id,
      },
    });

    // Update business plan
    await prisma.business.update({
      where: { id: payment.businessId },
      data: {
        plan: payment.plan,
        planStatus: "ACTIVE",
        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

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

export async function getPayment({ paymentIdDB }: { paymentIdDB: string }) {
  try {
    console.log("Getting payment for paymentId:", paymentIdDB);

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
