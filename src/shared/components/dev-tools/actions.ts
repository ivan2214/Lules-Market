"use server";

import { os } from "@orpc/server";
import { updateTag } from "next/cache";
import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";

export const clearUsersCache = os
  .handler(async () => {
    try {
      // Delete in proper order due to foreign key constraints
      await db.delete(schema.session);
      await db.delete(schema.emailVerificationToken);
      await db.delete(schema.passwordResetToken);
      await db.delete(schema.account);
      await db.delete(schema.admin);
      await db.delete(schema.business);
      await db.delete(schema.user);
      updateTag(CACHE_TAGS.DEV_TOOLS.GET_ALL);
      return { success: true };
    } catch (error) {
      console.error("Error al borrar usuarios", error);
      throw new Error("Error al borrar usuarios");
    }
  })
  .actionable();
