"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const getCurrentSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return {
      user: session?.user,
      admin: session?.admin,
      business: session?.business,
    };
  } catch (error) {
    console.log(error);
    return {
      user: null,
      admin: null,
      business: null,
    };
  }
});
