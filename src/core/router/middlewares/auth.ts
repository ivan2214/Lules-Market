import type { User } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { base } from "./base";

export const requiredAuthMiddleware = base
  .$context<{ user?: User }>()
  .middleware(async ({ context, next }) => {
    const user = context.user ?? (await getSession());

    if (!user) {
      return redirect("/api/auth/signin");
    }

    return next({
      context: { user },
    });
  });

async function getSession() {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  return sessionData?.user;
}
