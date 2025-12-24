import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admin } from "@/db/schema";
import { requiredAuthMiddleware } from "./auth";

export const requireAdminMiddleware = requiredAuthMiddleware.concat(
  async ({ context, next, errors }) => {
    try {
      const adminFound = await db.query.admin.findFirst({
        where: eq(admin.userId, context.user.id),
      });
      if (!adminFound) {
        throw errors.UNAUTHORIZED();
      }
      return next({
        context: {
          admin: adminFound,
        },
      });
    } catch (error) {
      console.error("Error checking admin authorization:", error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);
