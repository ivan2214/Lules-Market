import type React from "react";
import { Suspense } from "react";
import { DashboardHeaderWrapper } from "@/components/dashboard/dashboard-header-wrapper";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeaderSkeleton } from "@/components/skeletons/dashboard-header-skeleton";
import { DashboardSidebarSkeleton } from "@/components/skeletons/dashboard-sidebar-skeleton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Suspense fallback={<DashboardSidebarSkeleton />}>
          <DashboardSidebar />
        </Suspense>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Suspense fallback={<DashboardHeaderSkeleton />}>
          <DashboardHeaderWrapper />
        </Suspense>
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
