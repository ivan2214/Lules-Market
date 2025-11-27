import type { PlanType } from "@/app/generated/prisma/client";
import { getSubscriptionLimits } from "@/lib/subscription-limits";
import "server-only";

type PolicyUser = {
  userId: string;
  email: string;
  activePlan: PlanType;
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
  product: { id: string; businesId?: string },
) {
  if (!user) return false;
  if (product.businesId && product.businesId === user.userId) return true;
  return false;
}

export function canDeleteProduct(
  user: PolicyUser | null,
  product: { id: string; businesId?: string },
) {
  return canEditProduct(user, product);
}

export function canAddProduct(currentCount: number, plan: PlanType): boolean {
  const limits = getSubscriptionLimits(plan);
  if (limits.maxProducts === -1) return true;
  return currentCount < limits.maxProducts;
}

export function canFeatureProduct(plan: PlanType): boolean {
  return getSubscriptionLimits(plan).canFeatureProducts;
}
