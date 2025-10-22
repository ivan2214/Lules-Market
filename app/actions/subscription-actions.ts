"use server";

import { revalidatePath } from "next/cache";
import type { SubscriptionPlan } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { requireBusiness } from "../data/business/require-busines";

export async function upgradePlan(plan: SubscriptionPlan) {
  const { business } = await requireBusiness();

  if (business.plan === plan) {
    throw new Error("Ya tienes este plan activo");
  }

  // This will be completed when Mercado Pago is integrated
  // For now, just update the plan
  const updated = await prisma.business.update({
    where: { id: business.id },
    data: {
      plan,
      planStatus: "ACTIVE",
      planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  revalidatePath("/dashboard/subscription");
  revalidatePath("/dashboard");
  return updated;
}

export async function cancelSubscription() {
  const { business } = await requireBusiness();

  if (business.plan === "FREE") {
    throw new Error("No tienes una suscripción activa");
  }

  const updated = await prisma.business.update({
    where: { id: business.id },
    data: {
      planStatus: "CANCELLED",
    },
  });

  revalidatePath("/dashboard/subscription");
  return updated;
}

export async function getSubscriptionHistory() {
  const { business } = await requireBusiness();

  const payments = await prisma.payment.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
  });

  return payments;
}
