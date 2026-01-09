"use client";

import type { allRoles } from "@/lib/auth/roles";
import { useAccessControl } from "@/shared/providers/auth-provider";

export function HasRole({
  children,
  role,
}: {
  children: React.ReactNode;
  role: keyof typeof allRoles;
}) {
  const { hasRole } = useAccessControl();

  if (hasRole(role)) {
    return <>{children}</>;
  }

  return null;
}
