import { redirect } from "next/navigation";
import type React from "react";
import pathsConfig from "@/config/paths.config";
import { getCurrentBusiness } from "@/data/business/get-current-business";
import { requireBusiness } from "@/data/business/require-business";
import { AppBreadcrumbs } from "@/shared/components/app-breadcrumb";
import { Sidebar } from "@/shared/components/sidebar/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";

export const dynamic = "force-dynamic";
/* revalidar cada 30 minutos */
export const revalidate = 1800;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireBusiness();
  const { currentBusiness } = await getCurrentBusiness();

  if (!currentBusiness || !currentBusiness?.user) {
    redirect(pathsConfig.auth.signIn);
  }

  return (
    <SidebarProvider>
      <Sidebar
        userRole={currentBusiness?.user?.role}
        name={currentBusiness?.user?.name}
        email={currentBusiness?.user?.email}
        avatar={currentBusiness?.user?.image}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
