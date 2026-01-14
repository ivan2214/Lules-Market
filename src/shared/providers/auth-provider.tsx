import { useCallback, useMemo } from "react";
import type { UserRole } from "@/db/types";
import { authClient } from "@/lib/auth/auth-client";

export function useAuth() {
  const { data: auth, error } = authClient.useSession();
  if (!auth || error) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return auth;
}

export function useAccessControl() {
  const roles: UserRole[] = ["ADMIN", "USER", "BUSINESS", "SUPER_ADMIN"];
  const auth = useAuth();

  const role = useMemo(() => {
    return auth?.user?.role;
  }, [auth?.user?.role]);

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
