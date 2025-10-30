// ✅ Componente separado para el header con auth

import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/app/data/admin/admin.dal";
import { requireAdmin } from "@/app/data/admin/admin.require";
import { AdminHeader } from "./admin-header";

// ✅ Componente separado para el header con auth
export async function AdminHeaderWrapper() {
  await requireAdmin();
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/auth/signin");
  return <AdminHeader admin={admin} />;
}
