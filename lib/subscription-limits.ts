import type { SubscriptionPlan } from "@/app/generated/prisma";
import { PLAN_PRICES } from "./constants";

export const SUBSCRIPTION_LIMITS = {
  FREE: {
    maxProducts: 10,
    canFeatureProducts: false,
    hasStatistics: false,
    searchPriority: 3,
    price: PLAN_PRICES.FREE,
  },
  BASIC: {
    maxProducts: 50,
    canFeatureProducts: false,
    hasStatistics: true,
    searchPriority: 2,
    price: PLAN_PRICES.BASIC,
  },
  PREMIUM: {
    maxProducts: -1, // unlimited
    canFeatureProducts: true,
    hasStatistics: true,
    searchPriority: 1,
    price: PLAN_PRICES.PREMIUM, // ARS
  },
} as const;

export function getSubscriptionLimits(plan: SubscriptionPlan) {
  return SUBSCRIPTION_LIMITS[plan];
}
