"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { checkAdminPermission } from "@/app/actions/check-admin-permission";
import { getCurrentAdmin } from "@/app/data/admin/admin.require";
import { db, schema } from "@/db";

export const bannedBusiness = async (
  businessId: string,
): Promise<{
  ok: boolean;
  error?: string;
}> => {
  try {
    const admin = await getCurrentAdmin();

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

    // Busca el comercio
    const existBusiness = await db.query.business.findFirst({
      where: eq(schema.business.id, businessId),
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

    // 5. 🛑 Validación de Estado: Evitar trabajo innecesario
    if (existBusiness.isBanned) {
      return {
        ok: false,
        error: `Comercio con ID ${businessId} ya está baneado. Proceso omitido.`,
      };
    }

    // 6. ✅ Transacción Atómica
    await db.transaction(async (tx) => {
      // a) Registrar o actualizar el registro de baneo
      await tx
        .insert(schema.bannedBusiness)
        .values({
          bannedById: admin.userId,
          businessId: existBusiness.id,
        })
        .onConflictDoUpdate({
          target: schema.bannedBusiness.businessId,
          set: {
            bannedById: admin.userId,
          },
        });

      // b) Marcar al comercio como baneado
      await tx
        .update(schema.business)
        .set({ isBanned: true })
        .where(eq(schema.business.id, businessId));
    });

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
  businessId: string,
): Promise<{
  ok: boolean;
  error?: string;
}> => {
  try {
    const admin = await getCurrentAdmin();

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

    // Busca el comercio
    const existBusiness = await db.query.business.findFirst({
      where: eq(schema.business.id, businessId),
      with: {
        bannedBusiness: true,
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
    await db.transaction(async (tx) => {
      // a) Eliminar el registro de la tabla BannedBusiness
      await tx
        .delete(schema.bannedBusiness)
        .where(eq(schema.bannedBusiness.businessId, existBusiness.id));

      // b) Marcar al comercio como NO baneado
      await tx
        .update(schema.business)
        .set({ isBanned: false })
        .where(eq(schema.business.id, businessId));
    });

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
