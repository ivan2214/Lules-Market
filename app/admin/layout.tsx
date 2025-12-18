import type React from "react";
import { Suspense } from "react";
import { AdminHeaderWrapper } from "@/app/admin/_components/admin-header-wrapper";
import { AdminSidebar } from "@/app/admin/_components/admin-sidebar";
import { AdminHeaderSkeleton } from "@/app/admin/_components/skeletons/admin-header-skeleton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex">
        <AdminSidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<AdminHeaderSkeleton />}>
          <AdminHeaderWrapper />
        </Suspense>
        <main className="flex-1 bg-background p-6">{children}</main>
      </div>
    </div>
  );
}
