// ✅ Componente separado para el header con auth

import { redirect } from "next/navigation";
import { connection } from "next/server";
import { requireAdmin } from "@/shared/actions/admin/admin.require";
import { getCurrentAdmin } from "@/shared/actions/admin/get-current-admin";
import { AdminHeader } from "./admin-header";

// ✅ Componente separado para el header con auth
export async function AdminHeaderWrapper() {
  await connection();
  await requireAdmin();

  const admin = await getCurrentAdmin();
  if (!admin) redirect("/signin");
  return <AdminHeader admin={admin} />;
}
