import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import DashboardLoading from "./loading";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<DashboardSidebarFallback />}>
        <DashboardSidebarWrapper />
      </Suspense>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Suspense fallback={<Skeleton className="h-4 w-32" />}>
              <AppBreadcrumbs />
            </Suspense>
          </div>
        </header>
        <section className="flex flex-1 p-4 pt-0">
          <Suspense fallback={<DashboardLoading />}>
            <DashboardContentWrapper>{children}</DashboardContentWrapper>
          </Suspense>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function DashboardSidebarWrapper() {
  await connection();
  const { currentBusiness } = await getCurrentBusiness();

  if (!currentBusiness || !currentBusiness?.user) {
    return null;
  }

  return (
    <Sidebar
      userRole={currentBusiness.user.role}
      name={currentBusiness.user.name}
      email={currentBusiness.user.email}
      avatar={currentBusiness.logo?.url || currentBusiness.user.image}
    />
  );
}

async function DashboardContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  await requireBusiness();
  const { currentBusiness } = await getCurrentBusiness();

  if (!currentBusiness || !currentBusiness?.user) {
    redirect(pathsConfig.auth.signIn);
  }

  return <section className="w-full">{children}</section>;
}

function DashboardSidebarFallback() {
  return (
    <div className="flex h-screen w-(--sidebar-width) flex-col space-y-4 border-r bg-sidebar p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="space-y-3 pt-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="mt-auto border-t pt-4">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
