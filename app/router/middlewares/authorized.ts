import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admin, business } from "@/db/schema";
import { authed } from "./auth";

export const authorizedLogged = authed;

export const adminAuthorized = authorizedLogged.use(
  async ({ context, next }) => {
    try {
      const adminFound = await db.query.admin.findFirst({
        where: eq(admin.userId, context.user.id),
      });
      if (!adminFound) {
        throw new ORPCError("UNAUTHORIZED");
      }
      return next({
        context: {
          admin: adminFound,
        },
      });
    } catch (error) {
      console.error("Error checking admin authorization:", error);
      throw new ORPCError("UNAUTHORIZED");
    }
  },
);

export const businessAuthorized = authorizedLogged.use(
  async ({ context, next }) => {
    try {
      const businessFound = await db.query.business.findFirst({
        where: eq(business.userId, context.user.id),
        with: {
          currentPlan: {
            with: {
              plan: true,
            },
          },
          logo: true,
          coverImage: true,
        },
      });

      if (!businessFound) {
        throw new ORPCError("UNAUTHORIZED");
      }
      return next({
        context: {
          business: businessFound,
        },
      });
    } catch (error) {
      console.error("Error checking business authorization:", error);
      throw new ORPCError("UNAUTHORIZED");
    }
  },
);
