"use server";

import { updateTag } from "next/cache";
import { db, schema } from "@/db";

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
    updateTag("dev-tools");
  } catch (error) {
    console.error("Error al borrar usuarios", error);
    return {
      error: "Error al borrar usuarios",
    };
  }
};
