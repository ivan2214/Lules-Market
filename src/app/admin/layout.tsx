import { connection } from "next/server";
import { Suspense } from "react";
import { getCurrentAdmin } from "@/data/admin/get-current-admin";
import { requireAdmin } from "@/data/admin/require-admin";
import type { UserRole } from "@/db/types";
import { AppBreadcrumbs } from "@/shared/components/app-breadcrumb";
import { Sidebar } from "@/shared/components/sidebar/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Loading from "./loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AdminSidebarFallback />}>
        <AdminSidebarWrapper />
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
        <div className="flex flex-1 p-4 pt-0">
          <Suspense fallback={<Loading />}>
            <AdminContentWrapper>{children}</AdminContentWrapper>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function AdminSidebarWrapper() {
  await connection();
  const { admin } = await getCurrentAdmin();

  if (!admin || !admin?.user) {
    return null;
  }

  const userRole = admin.user.role as UserRole;

  return (
    <Sidebar
      userRole={userRole}
      name={admin.user.name || ""}
      email={admin.user.email || ""}
      avatar={admin.user.image}
    />
  );
}

async function AdminContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  await requireAdmin();
  return <>{children}</>;
}

function AdminSidebarFallback() {
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
