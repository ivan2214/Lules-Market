import type { SubscriptionPlan } from "@/app/generated/prisma";
import { getSubscriptionLimits } from "@/lib/subscription-limits";
import "server-only";

type PolicyUser = {
  id: string;
  email: string;
  activePlan: SubscriptionPlan;
};
/* 
  - Un usuario puede crear un producto si esta registrado.
  - Un usuario puede crear un producto si tiene un plan activo.
*/
export function canCreateProduct(user: PolicyUser | null) {
  if (!user?.activePlan) return false;
  return !!user;
}

export function canEditProduct(
  user: PolicyUser | null,
  product: { id: string; businesId?: string }
) {
  if (!user) return false;
  if (product.businesId && product.businesId === user.id) return true;
  return false;
}

export function canDeleteProduct(
  user: PolicyUser | null,
  product: { id: string; businesId?: string }
) {
  return canEditProduct(user, product);
}

export function canAddProduct(
  currentCount: number,
  plan: SubscriptionPlan
): boolean {
  const limits = getSubscriptionLimits(plan);
  if (limits.maxProducts === -1) return true;
  return currentCount < limits.maxProducts;
}

export function canFeatureProduct(plan: SubscriptionPlan): boolean {
  return getSubscriptionLimits(plan).canFeatureProducts;
}
