"use server";

import { updateTag } from "next/cache";
import { getCurrentAdmin } from "@/app/data/admin/admin.dal";
import type { Permission } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";

async function checkAdminPermission(
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

export const bannedUser = async (
  userId: string
): Promise<{
  ok: boolean;
  error?: string;
}> => {
  try {
    const admin = await getCurrentAdmin(); // Obtiene el administrador actual.

    // 1. 🛑 Validación del Administrador
    if (!admin) {
      return {
        ok: false,
        error: "Permiso denegado: No se encontró un administrador activo.",
      };
    }

    // 2. 🛑 VALIDACIÓN DE PERMISOS
    const hasPermission = await checkAdminPermission(admin.userId, "BAN_USERS");

    if (!hasPermission) {
      return {
        ok: false,
        error: `Permiso denegado: Admin ${admin.userId} no tiene permiso para BAN_USERS.`,
      };
    }

    // Busca el usuario y sus relaciones clave para las validaciones.
    const existUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        admin: true, // Para verificar si es administrador.
      },
    });

    // 3. 🛑 Validación de Existencia de Usuario
    if (!existUser) {
      return {
        ok: false,
        error: `Usuario con ID ${userId} no encontrado.`,
      };
    }

    // 4. 🛑 Validación de Autobaneo
    if (existUser.id === admin.userId) {
      return {
        ok: false,
        error:
          "Alerta de seguridad: Un administrador intentó auto-banearse. Acción bloqueada.",
      };
    }

    // 5. 🛑 Validación de Rol: Proteger a otros Administradores
    if (existUser.admin) {
      // Considera un check adicional si el admin actual es SUPER_ADMIN.
      return {
        ok: false,
        error: `Permiso denegado: No se permite banear a otro Administrador (ID: ${userId}).`,
      };
    }

    // 6. 🛑 Validación de Estado: Evitar trabajo innecesario (Opcional)
    if (existUser.isBanned) {
      return {
        ok: false,
        error: `Usuario con ID ${userId} ya está baneado. Proceso omitido.`,
      };
    }

    // 7. ✅ Transacción Atómica
    // Ambas operaciones (registro del baneo y actualización del estado del usuario)
    // deben tener éxito o ninguna debe ejecutarse.
    await prisma.$transaction([
      // a) Registrar o actualizar el registro de baneo
      prisma.bannedUser.upsert({
        where: { userId: existUser.id },
        create: {
          bannedById: admin.userId,
          userId: existUser.id,
        },
        update: {
          bannedById: admin.userId,
          userId: existUser.id,
        },
      }),

      // b) Marcar al usuario como baneado
      prisma.user.update({
        where: { id: userId },
        data: { isBanned: true },
      }),
    ]);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: `Error crítico al banear usuario:${error}`,
    };
  } finally {
    updateTag("users-page");
  }
};

export const unbannedUser = async (
  userId: string
): Promise<{
  ok: boolean;
  error?: string;
}> => {
  try {
    const admin = await getCurrentAdmin(); // Obtiene el administrador actual.

    // 1. 🛑 Validación del Administrador
    if (!admin) {
      return {
        ok: false,
        error: "Permiso denegado: No se encontró un administrador activo.",
      };
    }

    // 2. 🛑 VALIDACIÓN DE PERMISOS
    // Se utiliza 'BAN_USERS' ya que este permiso suele cubrir ambas acciones (banear y desbanear).
    const hasPermission = await checkAdminPermission(admin.userId, "BAN_USERS");

    if (!hasPermission) {
      return {
        ok: false,
        error: `Permiso denegado: Admin ${admin.userId} no tiene permiso para BAN_USERS.`,
      };
    }

    // Busca el usuario y verifica si está baneado.
    const existUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        bannedUser: true, // Incluimos el registro de baneo.
      },
    });

    // 3. 🛑 Validación de Existencia de Usuario
    if (!existUser) {
      return {
        ok: false,
        error: `Usuario con ID ${userId} no encontrado.`,
      };
    }

    // 4. 🛑 Validación de Estado: Evitar trabajo innecesario
    if (!existUser.isBanned) {
      return {
        ok: false,
        error: `Usuario con ID ${userId} no está baneado. Proceso omitido.`,
      };
    }

    // 5. ✅ Transacción Atómica
    // Ambas operaciones (eliminación del registro de baneo y actualización del estado del usuario)
    await prisma.$transaction([
      // a) Eliminar el registro de la tabla BannedUser
      // Usamos deleteMany ya que es más seguro si por alguna razón hubiera varios registros
      // aunque por el @unique en el schema, solo debería haber uno.
      prisma.bannedUser.deleteMany({
        where: { userId: existUser.id },
      }),

      // b) Marcar al usuario como NO baneado
      prisma.user.update({
        where: { id: userId },
        data: { isBanned: false },
      }),
    ]);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: `Error crítico al desbanear usuario: ${error}`,
    };
  } finally {
    updateTag("users-page");
  }
};
