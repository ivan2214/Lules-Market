import type React from "react";
import { Suspense } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "../data/admin/admin.require";

async function AdminGuard({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}

function AdminHeaderSkeleton() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="h-4 w-40 rounded bg-muted" />
      <div className="h-8 w-8 rounded bg-muted" />
    </header>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<AdminHeaderSkeleton />}>
          <AdminHeader />
        </Suspense>
        <main className="flex-1 bg-background p-6">
          <Suspense fallback="Cargando...">
            <AdminGuard>{children}</AdminGuard>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
