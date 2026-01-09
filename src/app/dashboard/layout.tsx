import { redirect } from "next/navigation";
import type React from "react";
import pathsConfig from "@/config/paths.config";
import { DashboardHeaderWrapper } from "@/features/dashboard/_components/dashboard-header-wrapper";
import { DashboardSidebar } from "@/features/dashboard/_components/dashboard-sidebar";
import { getCurrentBusiness } from "@/orpc/actions/business/get-current-business";
import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [error, result] = await getCurrentBusiness();

  if (error || !result.currentBusiness) {
    redirect(pathsConfig.business.setup);
  }

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

export default withAuthenticate(DashboardLayout, {
  role: "business",
  redirect: pathsConfig.business.setup,
});
