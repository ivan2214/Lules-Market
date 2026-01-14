// ✅ Componente separado para el header con auth

import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentBusiness } from "@/data/business/get-current-business";
import { DashboardHeader } from "./dashboard-header";

// ✅ Componente separado para el header con auth
export async function DashboardHeaderWrapper() {
  const { currentBusiness } = await getCurrentBusiness();

  if (!currentBusiness) {
    redirect(pathsConfig.auth.signIn);
  }

  return <DashboardHeader business={currentBusiness} />;
}
