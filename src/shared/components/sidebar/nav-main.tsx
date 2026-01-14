"use client";

import type { LucideIcon } from "lucide-react";

import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { UserRole } from "@/db/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import { useAccessControl } from "@/shared/hooks/use-access-control";

export type NavMainItem = {
  title: string;
  url: Route;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: Array<{
    title: string;
    url: Route;
    role: UserRole;
    disabled?: boolean;
  }>;
  role: UserRole;
  disabled?: boolean;
};

export function NavMain({
  items,
  userRole,
}: {
  items: Array<NavMainItem>;
  userRole: UserRole;
}) {
  const { hasRole } = useAccessControl(userRole);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (item.role && !hasRole(item.role)) {
            return null;
          }
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <Link href={item.url} aria-disabled={item.disabled}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      disabled={item.disabled}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      if (subItem.role && !hasRole(subItem.role)) {
                        return null;
                      }
                      return (
                        <SidebarMenuSubItem
                          key={subItem.title}
                          aria-disabled={subItem.disabled}
                        >
                          <SidebarMenuSubButton
                            aria-disabled={subItem.disabled}
                            asChild
                          >
                            <Link
                              href={subItem.url}
                              aria-disabled={subItem.disabled}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
