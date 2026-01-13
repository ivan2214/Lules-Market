import { redirect } from "next/navigation";
import type React from "react";
import pathsConfig from "@/config/paths.config";
import { getCurrentBusiness } from "@/data/business/get-current-business";
import { requireBusiness } from "@/data/business/require-business";
import { DashboardHeaderWrapper } from "@/features/dashboard/_components/dashboard-header-wrapper";
import { DashboardSidebar } from "@/features/dashboard/_components/dashboard-sidebar";
import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await requireBusiness();
  const { currentBusiness, success } = await getCurrentBusiness(userId);

  if (!success || !currentBusiness) {
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
