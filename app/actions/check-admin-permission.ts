"use server";

import { eq } from "drizzle-orm";
import { db, type Permission, schema } from "@/db";

export async function checkAdminPermission(
  adminId: string,
  permission: Permission,
): Promise<boolean> {
  try {
    const admin = await db.query.admin.findFirst({
      where: eq(schema.admin.userId, adminId),
      columns: { permissions: true },
    });

    // Asegura que exista el admin y que su lista de permisos incluya el permiso requerido.
    return (
      admin?.permissions?.includes("ALL") ||
      admin?.permissions?.includes(permission) ||
      false
    );
  } catch (error) {
    console.error("Error al verificar permisos del admin:", error);
    return false;
  }
}
