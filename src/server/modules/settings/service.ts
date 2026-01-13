import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { AppError } from "@/server/errors";

export abstract class SettingsService {
  static async updateAccount(userId: string, input: { name: string }) {
    const [updated] = await db
      .update(schema.user)
      .set({ name: input.name })
      .where(eq(schema.user.id, userId))
      .returning();

    return updated;
  }

  static async deleteAccount(userId: string) {
    try {
      const userFound = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, userId));

      if (!userFound.length) {
        throw new AppError("No se encontro el usuario.", "NOT_FOUND");
      }

      await db.delete(schema.user).where(eq(schema.user.id, userId));
      return {
        successMessage: "Tu cuenta ha sido eliminada correctamente.",
      };
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Hubo un error al eliminar tu cuenta.",
        "INTERNAL_SERVER_ERROR",
      );
    }
  }
}
