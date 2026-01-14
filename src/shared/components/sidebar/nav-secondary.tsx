"use client";

import type { Route } from "next";
import Link from "next/link";
import type * as React from "react";
import type { UserRole } from "@/db/types";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { useAccessControl } from "@/shared/providers/auth-provider";

export type NavSecondaryItem = {
  title: string;
  url: Route;
  icon: React.ElementType;
  role?: UserRole;
  disabled?: boolean;
  target?: "_blank";
};

export function NavSecondary({
  items,
  children,
  ...props
}: React.PropsWithChildren<{
  items: Array<NavSecondaryItem>;
}> &
  React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { hasRole } = useAccessControl();
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.role && !hasRole(item.role)) {
              return null;
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild disabled={item.disabled}>
                  <Link
                    href={item.url}
                    target={item.target}
                    aria-disabled={item.disabled}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          {children}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
