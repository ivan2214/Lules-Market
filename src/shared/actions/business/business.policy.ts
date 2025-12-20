import "server-only";
import type { PolicyUser } from "./_types";

export function canCreateBusiness(user: PolicyUser | null) {
  if (!user) return false;
  // Si el usuario ya tiene un plan activo no es impedimento para crear negocio
  return true;
}

export function canEditBusiness(
  user: PolicyUser | null,
  business: { id: string; userId?: string },
) {
  if (!user) return false;
  if (business.userId && business.userId === user.userId) return true;
  return false;
}

export function canDeleteBusiness(
  user: PolicyUser | null,
  business: { id: string; userId?: string },
) {
  return canEditBusiness(user, business);
}
