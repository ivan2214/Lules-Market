import { ORPCError, os } from "@orpc/server";
import type { User } from "better-auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { admin, business } from "@/db/schema";
import { auth } from "@/lib/auth";

export const requiredAuthMiddleware = os
  .$context<{ session?: { user?: User } }>()
  .middleware(async ({ context, next }) => {
    /**
     * Why we should ?? here?
     * Because it can avoid `getSession` being called when unnecessary.
     * {@link https://orpc.unnoq.com/docs/best-practices/dedupe-middleware}
     */
    const session = context.session ?? (await getSession());

    if (!session?.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({
      context: { user: session.user },
    });
  });

async function getSession() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  return sessionData;
}

export const authed = os.use(requiredAuthMiddleware);

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
