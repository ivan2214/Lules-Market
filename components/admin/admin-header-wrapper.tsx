// ✅ Componente separado para el header con auth

import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/data/admin/admin.dal";
import { AdminHeader } from "./admin-header";

// ✅ Componente separado para el header con auth
export async function AdminHeaderWrapper() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/auth/signin");
  return <AdminHeader admin={admin} />;
}
