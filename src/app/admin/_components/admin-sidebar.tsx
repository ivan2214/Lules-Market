"use client";
import { Search } from "lucide-react";
import pathsConfig from "@/config/paths.config";
import type { AdminWithRelations, UserRole } from "@/db/types";
import { AppLogo } from "@/shared/components/app-logo";
import { SearchCommandDialog } from "@/shared/components/search-command-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import {
  navDocumentsData,
  navPrimaryData,
  navResourceShopData,
  navSecondaryData,
  searchCommandData,
} from "./admin-sidebar-data";
import { NavDocuments } from "./sidebar/nav-documents";
import { NavPrimary } from "./sidebar/nav-primary";
import { NavResources } from "./sidebar/nav-resources";
import { NavSecondary } from "./sidebar/nav-secondary";
import { NavUser } from "./sidebar/nav-user";

export function AdminSidebar({
  admin,
  userRole,
}: {
  admin: AdminWithRelations;
  userRole: UserRole;
}) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <AppLogo path={pathsConfig.dashboard.root} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navPrimaryData} userRole={userRole} />
        {/* <NavMain items={navMainData} /> */}
        <NavResources
          resource="Shop"
          items={navResourceShopData}
          userRole={userRole}
        />
        <NavDocuments items={navDocumentsData} userRole={userRole} />
        <NavSecondary
          items={navSecondaryData}
          className="mt-auto"
          userRole={userRole}
        >
          <SearchCommandDialog
            commandsData={searchCommandData}
            userRole={userRole}
          >
            {({ open, setOpen }) => (
              <SidebarMenuItem
                className="bg-sidebar"
                onClick={() => setOpen(!open)}
              >
                <SidebarMenuButton>
                  <Search />
                  <span>Search</span>
                  <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>J
                  </kbd>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SearchCommandDialog>
        </NavSecondary>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: admin.user?.name ?? "",
            email: admin.user?.email ?? "",
            avatar: admin.user?.image ?? undefined,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
