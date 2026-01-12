// ✅ Componente separado para el header con auth

import { getCurrentBusiness } from "@/data/business/get-current-business";
import { requireBusiness } from "@/data/business/require-business";
import { DashboardHeader } from "./dashboard-header";

// ✅ Componente separado para el header con auth
export async function DashboardHeaderWrapper() {
  const { userId } = await requireBusiness();
  const { currentBusiness, error } = await getCurrentBusiness(userId);

  if (error || !currentBusiness) {
    throw new Error(error);
  }

  return <DashboardHeader business={currentBusiness} />;
}
