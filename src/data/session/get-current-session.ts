import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const getCurrentSession = cache(async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    return {
      user: session?.user,
      admin: session?.admin,
      business: session?.business,
      headers: headersList,
    };
  } catch {
    return {
      user: null,
      admin: null,
      business: null,
      headers: null,
    };
  }
});
