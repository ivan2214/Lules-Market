// ✅ Componente separado para el header con auth

import { getCurrentBusiness } from "@/orpc/actions/business/get-current-business";
import { DashboardHeader } from "./dashboard-header";

// ✅ Componente separado para el header con auth
export async function DashboardHeaderWrapper() {
  const { currentBusiness } = await getCurrentBusiness();

  return <DashboardHeader business={currentBusiness} />;
}
