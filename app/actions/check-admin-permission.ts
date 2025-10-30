"use server";

import prisma from "@/lib/prisma";
import type { Permission } from "../generated/prisma";

export async function checkAdminPermission(
  adminId: string,
  permission: Permission
): Promise<boolean> {
  try {
    const adminPermissions = await prisma.admin.findUnique({
      where: { userId: adminId },
      select: { permissions: true },
    });

    // Asegura que exista el admin y que su lista de permisos incluya el permiso requerido.
    return (
      adminPermissions?.permissions.includes("ALL") ||
      adminPermissions?.permissions?.includes(permission) ||
      false
    );
  } catch (error) {
    console.error("Error al verificar permisos del admin:", error);
    return false;
  }
}
