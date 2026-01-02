import "server-only";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admin as adminSchema } from "@/db/schema";
import { requireSession } from "@/orpc/actions/user/require-session";
import { actionContext, oa } from "@/orpc/middlewares";

export const getCurrentAdmin = oa
  .handler(async () => {
    try {
      const [error, session] = await requireSession();

      if (error || !session) {
        throw error;
      }

      const admin = await db.query.admin.findFirst({
        where: eq(adminSchema.userId, session.user.id),
        with: {
          user: true,
        },
      });

      return admin ?? null;
    } catch {
      throw new ORPCError("Error al obtener el administrador");
    }
  })
  .actionable({
    context: actionContext,
  });
