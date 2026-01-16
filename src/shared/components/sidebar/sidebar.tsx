"use client";
import { navPrimaryDataAdmin } from "@/app/admin/_constants";
import { navPrimaryDataDashboard } from "@/app/dashboard/_constants";
import pathsConfig from "@/config/paths.config";
import type { UserRole } from "@/db/types";
import { AppLogo } from "@/shared/components/app-logo";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { NavPrimary } from "./nav-primary";
import { NavUser } from "./nav-user";

export function Sidebar({
  userRole,
  name,
  email,
  avatar,
}: {
  userRole: UserRole;
  name: string;
  email: string;
  avatar?: string | null;
}) {
  return (
    <SidebarComponent variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <AppLogo
                path={
                  userRole === "ADMIN"
                    ? pathsConfig.admin.root
                    : pathsConfig.dashboard.root
                }
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary
          items={
            userRole === "ADMIN" ? navPrimaryDataAdmin : navPrimaryDataDashboard
          }
          userRole={userRole}
        />
        {/*   <NavMain
          items={
            userRole === "ADMIN" ? navPrimaryDataAdmin : navPrimaryDataDashboard
          }
          userRole={userRole}
        /> */}

        {/*>

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
        </NavSecondary> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name,
            email,
            avatar,
          }}
        />
      </SidebarFooter>
    </SidebarComponent>
  );
}
