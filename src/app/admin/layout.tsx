import { getCurrentAdmin } from "@/data/admin/get-current-admin";
import { requireAdmin } from "@/data/admin/require-admin";
import type { AdminWithRelations, UserRole } from "@/db/types";
import { AppBreadcrumbs } from "@/shared/components/app-breadcrumb";
import { Separator } from "@/shared/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { AdminSidebar } from "./_components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const { admin } = await getCurrentAdmin();
  const userRole = admin?.user?.role as UserRole;

  return (
    <SidebarProvider>
      <AdminSidebar admin={admin as AdminWithRelations} userRole={userRole} />
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
