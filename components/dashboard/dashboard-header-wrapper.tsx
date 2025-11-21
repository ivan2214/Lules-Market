// ✅ Componente separado para el header con auth

import { getCurrentBusiness } from "@/app/data/business/require-busines";
import { DashboardHeader } from "./dashboard-header";

// ✅ Componente separado para el header con auth
export async function DashboardHeaderWrapper() {
  const { currentBusiness } = await getCurrentBusiness();

  return <DashboardHeader business={currentBusiness} />;
}
