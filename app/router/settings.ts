import { eq } from "drizzle-orm";
import z from "zod";
import { db, schema } from "@/db";
import { authorized } from "./middlewares/authorized";
import { AccountUpdateSchema } from "./schemas";

export const updateAccount = authorized
  .route({
    method: "PATCH",
    description: "Update account",
    summary: "Update account",
    tags: ["Settings"],
  })
  .input(AccountUpdateSchema)
  .handler(async ({ context, input }) => {
    const { user } = context;

    const [updated] = await db
      .update(schema.user)
      .set({ name: input.name })
      .where(eq(schema.user.id, user.id))
      .returning();

    return updated;
  });

export const deleteAccount = authorized
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

      await db.delete(schema.user).where(eq(schema.user.id, user.id));
      return {
        successMessage: "Tu cuenta ha sido eliminada correctamente.",
      };
    } catch (error) {
      console.error("Error deleting account:", error);
      return {
        errorMessage: "Hubo un error al eliminar tu cuenta.",
      };
    }
  });
