"use client";

import type { Route } from "next";
import Link from "next/link";
import type { UserRole } from "@/db/types";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useAccessControl } from "@/shared/providers/auth-provider";

export type NavResourceItem = {
  title: string;
  url: Route;
  icon: React.ElementType;
  role?: UserRole;
  disabled?: boolean;
};

export function NavResources({
  resource,
  items,
}: {
  resource: string;
  items: Array<NavResourceItem>;
}) {
  const { hasRole } = useAccessControl();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{resource}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.role && !hasRole(item.role)) {
            return null;
          }
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild disabled={item.disabled}>
                <Link href={item.url} aria-disabled={item.disabled}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
