import type React from "react";
import { requireBusiness } from "@/data/business/require-business";
import { DashboardHeaderWrapper } from "@/features/dashboard/_components/dashboard-header-wrapper";
import { DashboardSidebar } from "@/features/dashboard/_components/dashboard-sidebar";

export const dynamic = "force-dynamic";
/* revalidar cada 30 minutos */
export const revalidate = 1800;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireBusiness();

  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <DashboardHeaderWrapper />
        <main className="flex-1 bg-muted/20 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
