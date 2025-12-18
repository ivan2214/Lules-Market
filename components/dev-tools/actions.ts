"use server";

import { updateTag } from "next/cache";
import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const clearUsersCache = async () => {
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
  } catch (error) {
    console.error("Error al borrar usuarios", error);
    return {
      error: "Error al borrar usuarios",
    };
  }
};
