import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentAdmin } from "@/app/data/admin/admin.dal";
import { Skeleton } from "../ui/skeleton";
import { AdminMenu } from "./admin-menu";

export function AdminHeader() {
  return (
    <Suspense fallback={<AdminHeaderSkeleton />}>
      <AdminHeaderInner />
    </Suspense>
  );
}

async function AdminHeaderInner() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/auth/signin");
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6 py-2">
      <div className="flex items-center gap-4">
        <h2 className="font-semibold text-foreground text-lg">
          Panel de Administración
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <Suspense fallback={<AdminMenuSkeleton />}>
          <AdminMenu admin={admin} />
        </Suspense>
      </div>
    </header>
  );
}

function AdminMenuSkeleton() {
  return <Skeleton className="h-8 w-8" />;
}

function AdminHeaderSkeleton() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="h-4 w-40 rounded bg-muted" />
      <div className="h-8 w-8 rounded bg-muted" />
    </header>
  );
}
