import type { Route } from "next";
import Link from "next/link";
import type { UserRole } from "@/db/types";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useAccessControl } from "@/shared/hooks/use-access-control";

export type NavPrimaryItem = {
  title: string;
  url: Route;
  icon: React.ElementType;
  role?: UserRole;
  disabled?: boolean;
};

export function NavPrimary({
  items,
  userRole,
}: {
  items: Array<NavPrimaryItem>;
  userRole: UserRole;
}) {
  const { hasRole } = useAccessControl(userRole);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Rutas</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            if (item.role && !hasRole(item.role)) {
              return null;
            }
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} aria-disabled={item.disabled}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    disabled={item.disabled}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
