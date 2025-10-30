"use server";

import { updateTag } from "next/cache";
import { checkAdminPermission } from "@/app/actions/check-admin-permission";
import { getCurrentAdmin } from "@/app/data/admin/admin.dal";
import prisma from "@/lib/prisma";

export const bannedBusiness = async (
  businessId: string
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

    // Busca el comercio y sus relaciones clave para las validaciones.
    const existBusiness = await prisma.business.findUnique({
      where: { id: businessId },
    });

    // 3. 🛑 Validación de Existencia de Comercio
    if (!existBusiness) {
      return {
        ok: false,
        error: `Comercio con ID ${businessId} no encontrado.`,
      };
    }

    // 4. 🛑 Validación de Autobaneo
    if (existBusiness.userId === admin.userId) {
      return {
        ok: false,
        error:
          "Alerta de seguridad: Un administrador intentó auto-banearse. Acción bloqueada.",
      };
    }

    // 5. 🛑 Validación de Estado: Evitar trabajo innecesario (Opcional)
    if (existBusiness.isBanned) {
      return {
        ok: false,
        error: `Comercio con ID ${businessId} ya está baneado. Proceso omitido.`,
      };
    }

    // 6. ✅ Transacción Atómica
    // Ambas operaciones (registro del baneo y actualización del estado del comercio)
    // deben tener éxito o ninguna debe ejecutarse.
    await prisma.$transaction([
      // a) Registrar o actualizar el registro de baneo
      prisma.bannedBusiness.upsert({
        where: { businessId: existBusiness.id },
        create: {
          bannedById: admin.userId,
          businessId: existBusiness.id,
        },
        update: {
          bannedById: admin.userId,
          businessId: existBusiness.id,
        },
      }),

      // b) Marcar al comercio como baneado
      prisma.business.update({
        where: { id: businessId },
        data: { isBanned: true },
      }),
    ]);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: `Error crítico al banear comercio:${error}`,
    };
  } finally {
    updateTag("business-page");
  }
};

export const unbannedBusiness = async (
  businessId: string
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

    // Busca el comercio y verifica si está baneado.
    const existBusiness = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        bannedBusiness: true, // Incluimos el registro de baneo.
      },
    });

    // 3. 🛑 Validación de Existencia de Comercio
    if (!existBusiness) {
      return {
        ok: false,
        error: `Comercio con ID ${businessId} no encontrado.`,
      };
    }

    // 4. 🛑 Validación de Estado: Evitar trabajo innecesario
    if (!existBusiness.isBanned) {
      return {
        ok: false,
        error: `Comercio con ID ${businessId} no está baneado. Proceso omitido.`,
      };
    }

    // 5. ✅ Transacción Atómica
    // Ambas operaciones (eliminación del registro de baneo y actualización del estado del comercio)
    await prisma.$transaction([
      // a) Eliminar el registro de la tabla BannedBusiness
      // Usamos deleteMany ya que es más seguro si por alguna razón hubiera varios registros
      // aunque por el @unique en el schema, solo debería haber uno.
      prisma.bannedBusiness.deleteMany({
        where: { businessId: existBusiness.id },
      }),

      // b) Marcar al comercio como NO baneado
      prisma.business.update({
        where: { id: businessId },
        data: { isBanned: false },
      }),
    ]);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: `Error crítico al desbanear comercio: ${error}`,
    };
  } finally {
    updateTag("business-page");
  }
};
