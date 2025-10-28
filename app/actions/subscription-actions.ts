"use server";

import type { SubscriptionPlan } from "@/app/generated/prisma";
import * as SubscriptionDAL from "../data/subscription/subscription.dal";

export async function createPaymentPreference(plan: SubscriptionPlan) {
  return SubscriptionDAL.createPaymentPreference(plan);
}

export async function upgradePlan(plan: SubscriptionPlan) {
  return SubscriptionDAL.upgradePlan(plan);
}

export async function cancelSubscription() {
  return SubscriptionDAL.cancelSubscription();
}

export async function getSubscriptionHistory() {
  return SubscriptionDAL.getSubscriptionHistory();
}

export async function startTrial(plan: SubscriptionPlan = "PREMIUM") {
  return SubscriptionDAL.startTrial(plan);
}

export async function redeemCoupon(code: string) {
  return SubscriptionDAL.redeemCoupon(code);
}
