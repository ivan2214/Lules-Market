// ✅ Componente separado para el header con auth

import { requireBusiness } from "@/app/data/business/require-busines";
import { DashboardHeader } from "./header";

// ✅ Componente separado para el header con auth
export async function DashboardHeaderWrapper() {
  const { business } = await requireBusiness();
  return <DashboardHeader business={business} />;
}
