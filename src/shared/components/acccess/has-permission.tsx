import type { allRoles } from "@/lib/auth/roles";
import { useAccessControl } from "@/shared/providers/auth-provider";

type AuthorizeFunction = (typeof allRoles)[keyof typeof allRoles]["authorize"];

export function HasPermission({
  children,
  permissions,
  connector,
}: {
  children: React.ReactNode;
  permissions: Parameters<AuthorizeFunction>[0];
  connector: Parameters<AuthorizeFunction>[1];
}) {
  const { hasPermission } = useAccessControl();

  if (hasPermission(permissions, connector)) {
    return <>{children}</>;
  }

  return null;
}
