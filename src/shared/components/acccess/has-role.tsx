"use client";

import type { UserRole } from "@/db/types";
import { useAccessControl } from "@/shared/hooks/use-access-control";

export function HasRole({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const { hasRole } = useAccessControl(role);

  if (hasRole(role)) {
    return <>{children}</>;
  }

  return null;
}
