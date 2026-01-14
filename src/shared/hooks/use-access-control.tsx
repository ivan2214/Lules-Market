import { useCallback, useMemo } from "react";
import type { UserRole } from "@/db/types";

export function useAccessControl(userRole: UserRole) {
  const roles: UserRole[] = ["ADMIN", "USER", "BUSINESS", "SUPER_ADMIN"];

  const role = useMemo(() => {
    return userRole;
  }, [userRole]);

  const hasRole = useCallback(
    (role: UserRole) => {
      return roles.includes(role);
    },
    [roles],
  );

  return {
    roles,
    hasRole,
    role,
  };
}
