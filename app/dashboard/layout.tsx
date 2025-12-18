import type React from "react";
import { Suspense } from "react";
import { DashboardHeaderWrapper } from "@/app/dashboard/_components/dashboard-header-wrapper";
import { DashboardSidebar } from "@/app/dashboard/_components/dashboard-sidebar";
import { DashboardHeaderSkeleton } from "@/app/shared/components/skeletons/dashboard-header-skeleton";
import { DashboardSidebarSkeleton } from "@/app/shared/components/skeletons/dashboard-sidebar-skeleton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex">
        <Suspense fallback={<DashboardSidebarSkeleton />}>
          <DashboardSidebar />
        </Suspense>
      </div>
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<DashboardHeaderSkeleton />}>
          <DashboardHeaderWrapper />
        </Suspense>
        <main className="flex-1 bg-muted/20 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
