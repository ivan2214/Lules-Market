import type React from "react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { requireBusiness } from "../data/business/require-busines";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { business } = await requireBusiness();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader business={business} />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
