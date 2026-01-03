// ✅ Componente separado para el header con auth

import { getCurrentBusiness } from "@/orpc/actions/business/get-current-business";
import { DashboardHeader } from "./dashboard-header";

// ✅ Componente separado para el header con auth
export async function DashboardHeaderWrapper() {
  const [error, result] = await getCurrentBusiness();

  if (error) {
    throw new Error(error.message);
  }

  const currentBusiness = result?.currentBusiness;

  return <DashboardHeader business={currentBusiness} />;
}
