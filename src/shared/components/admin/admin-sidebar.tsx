"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { authClient } from "@/lib/auth/auth-client";
import { AppLogo } from "@/shared/components/app-logo";
import { SearchCommandDialog } from "@/shared/components/search-command-dialog";
import { NavDocuments } from "@/shared/components/sidebar/nav-documents";
import { NavPrimary } from "@/shared/components/sidebar/nav-primary";
import { NavResources } from "@/shared/components/sidebar/nav-resources";
import { NavSecondary } from "@/shared/components/sidebar/nav-secondary";
import { NavUser } from "@/shared/components/sidebar/nav-user";
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

export function AdminSidebar() {
  const { data } = authClient.useSession();
  const admin = data?.admin;
  const router = useRouter();

  if (!admin) {
    router.replace(pathsConfig.auth.signIn);
    return null;
  }
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
        <NavPrimary items={navPrimaryData} />
        {/* <NavMain items={navMainData} /> */}
        <NavResources resource="Shop" items={navResourceShopData} />
        <NavDocuments items={navDocumentsData} />
        <NavSecondary items={navSecondaryData} className="mt-auto">
          <SearchCommandDialog commandsData={searchCommandData}>
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
            name: admin.user.name,
            email: admin.user.email,
            avatar: admin.user.image ?? undefined,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
