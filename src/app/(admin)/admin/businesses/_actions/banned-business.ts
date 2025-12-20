"use server";

import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { db, schema } from "@/db";
import { orpc } from "@/lib/orpc";
import { getCurrentAdmin } from "@/shared/actions/admin/get-current-admin";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";
import { BannedBusinessInputSchema } from "../../_validations";

export const bannedBusiness = os
  .input(BannedBusinessInputSchema)
  .handler(async ({ input }) => {
    const { businessId } = input;
    try {
      const admin = await getCurrentAdmin();

      // 1. 🛑 Validación del Administrador
      if (!admin) {
        throw new Error(
          "Permiso denegado: No se encontró un administrador activo.",
        );
      }

      // 2. 🛑 VALIDACIÓN DE PERMISOS
      const hasPermission = await orpc.admin.checkAdminPermission({
        adminId: admin.userId,
        permission: "BAN_USERS",
      });

      if (!hasPermission) {
        throw new Error(
          `Permiso denegado: Admin ${admin.userId} no tiene permiso para BAN_USERS.`,
        );
      }

      // Busca el comercio
      const existBusiness = await db.query.business.findFirst({
        where: eq(schema.business.id, businessId),
      });

      // 3. 🛑 Validación de Existencia de Comercio
      if (!existBusiness) {
        throw new Error(`Comercio con ID ${businessId} no encontrado.`);
      }

      // 4. 🛑 Validación de Autobaneo
      if (existBusiness.userId === admin.userId) {
        throw new Error(
          "Alerta de seguridad: Un administrador intentó auto-banearse. Acción bloqueada.",
        );
      }

      // 5. 🛑 Validación de Estado: Evitar trabajo innecesario
      if (existBusiness.isBanned) {
        throw new Error(
          `Comercio con ID ${businessId} ya está baneado. Proceso omitido.`,
        );
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

      updateTag(CACHE_TAGS.BUSINESS.GET_ALL);
      updateTag(CACHE_TAGS.BUSINESS.GET_BY_ID(businessId));

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw error; // Let the client handle the error message
      }
      throw new Error(`Error crítico al banear comercio: ${error}`);
    }
  })
  .actionable();

export const unbannedBusiness = os
  .input(BannedBusinessInputSchema)
  .handler(async ({ input }) => {
    const { businessId } = input;
    try {
      const admin = await getCurrentAdmin();

      // 1. 🛑 Validación del Administrador
      if (!admin) {
        throw new Error(
          "Permiso denegado: No se encontró un administrador activo.",
        );
      }

      // 2. 🛑 VALIDACIÓN DE PERMISOS
      const hasPermission = await orpc.admin.checkAdminPermission({
        adminId: admin.userId,
        permission: "BAN_USERS",
      });

      if (!hasPermission) {
        throw new Error(
          `Permiso denegado: Admin ${admin.userId} no tiene permiso para BAN_USERS.`,
        );
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
        throw new Error(`Comercio con ID ${businessId} no encontrado.`);
      }

      // 4. 🛑 Validación de Estado: Evitar trabajo innecesario
      if (!existBusiness.isBanned) {
        throw new Error(
          `Comercio con ID ${businessId} no está baneado. Proceso omitido.`,
        );
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

      updateTag(CACHE_TAGS.BUSINESS.GET_ALL);
      updateTag(CACHE_TAGS.BUSINESS.GET_BY_ID(businessId));

      return {
        ok: true,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Error crítico al desbanear comercio: ${error}`);
    }
  })
  .actionable();
