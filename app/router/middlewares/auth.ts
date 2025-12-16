import { ORPCError, os } from "@orpc/server";
import type { User } from "better-auth";
import { headers } from "next/headers";
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
