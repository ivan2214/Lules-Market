import type { PlanType } from "@/app/generated/prisma/client";
import { PLAN_PRICES } from "./constants";

export const SUBSCRIPTION_LIMITS: Record<
  PlanType,
  {
    maxProducts: number;
    canFeatureProducts: boolean;
    hasStatistics: boolean;
    searchPriority: number;
    price: number;
  }
> = {
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
};

export function getSubscriptionLimits(plan?: PlanType | null) {
  if (!plan) return SUBSCRIPTION_LIMITS.FREE;
  return SUBSCRIPTION_LIMITS[plan];
}
