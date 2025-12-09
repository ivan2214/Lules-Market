"use server";

import type { PlanType } from "@/db";
import * as SubscriptionDAL from "../data/payment/payment.dal";

export async function createPaymentPreference(plan: PlanType) {
  return SubscriptionDAL.createPaymentPreference(plan);
}

export async function upgradePlan(plan: PlanType) {
  return SubscriptionDAL.upgradePlan(plan);
}

export async function cancelSubscription() {
  return SubscriptionDAL.cancelSubscription();
}

export async function getSubscriptionHistory() {
  return SubscriptionDAL.getSubscriptionHistory();
}

export async function startTrial(plan: PlanType = "PREMIUM") {
  return SubscriptionDAL.startTrial(plan);
}
