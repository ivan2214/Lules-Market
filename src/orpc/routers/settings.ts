import "server-only";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "@/db";
import * as schema from "@/db/schema";
import type { User } from "@/db/types";
import { o } from "@/orpc/context";
import { AccountUpdateSchema } from "@/shared/validators/account";
import { authMiddleware } from "../middlewares";

export const updateAccount = o
  .use(
    authMiddleware({
      role: "user",
    }),
  )
  .route({
    method: "PATCH",
    description: "Update account",
    summary: "Update account",
    tags: ["Settings"],
  })
  .input(AccountUpdateSchema)
  .output(z.custom<User>())
  .handler(async ({ context, input }) => {
    const { user } = context;

    const [updated] = await db
      .update(schema.user)
      .set({ name: input.name })
      .where(eq(schema.user.id, user.id))
      .returning();

    return updated;
  });

export const deleteAccount = o
  .use(
    authMiddleware({
      role: "user",
    }),
  )
  .route({
    method: "DELETE",
    description: "Delete account",
    summary: "Delete account",
    tags: ["Settings"],
  })
  .output(
    z.object({
      successMessage: z.string().optional(),
      errorMessage: z.string().optional(),
    }),
  )
  .handler(async ({ context }) => {
    try {
      const { user } = context;

      const userFound = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, user.id));

      if (!userFound.length) {
        throw new ORPCError("No se encontro el usuario.");
      }

      await db.delete(schema.user).where(eq(schema.user.id, user.id));
      return {
        successMessage: "Tu cuenta ha sido eliminada correctamente.",
      };
    } catch (error) {
      console.error("Error deleting account:", error);
      throw new ORPCError("Hubo un error al eliminar tu cuenta.");
    }
  });

export const settingsRouter = {
  updateAccount,
  deleteAccount,
};
