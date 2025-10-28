import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* <div className="hidden lg:flex">
        <Suspense fallback={<DashboardSidebarSkeleton />}>
          <DashboardSidebar />
        </Suspense>
      </div> */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ✅ Header también envuelto en Suspense */}
        {/* <Suspense fallback={<DashboardHeaderSkeleton />}>
          <DashboardHeaderWrapper />
        </Suspense> */}
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <div className="flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-0.5">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}

function DashboardSidebarSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Skeleton className="h-full w-64" />
      </div>
    </div>
  );
}
