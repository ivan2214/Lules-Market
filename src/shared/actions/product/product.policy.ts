import "server-only";
import { getCurrentBusiness } from "@/shared/actions/business/get-current-business";
import type { PolicyUser } from "./_types";

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

export async function canAddProduct(): Promise<boolean> {
  const { currentBusiness } = await getCurrentBusiness();

  const { productsUsed } = currentBusiness?.currentPlan || {};
  const { maxProducts } = currentBusiness?.currentPlan?.plan || {};
  if (maxProducts === -1) return true;
  if (!productsUsed) return false;
  if (!maxProducts) return false;
  return productsUsed < maxProducts;
}
