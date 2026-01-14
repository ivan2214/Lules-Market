"use client";

import type { UserRole } from "@/db/types";
import { useAccessControl } from "@/shared/providers/auth-provider";

export function HasRole({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const { hasRole } = useAccessControl();

  if (hasRole(role)) {
    return <>{children}</>;
  }

  return null;
}
