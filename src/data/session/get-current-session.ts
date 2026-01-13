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
      session,
    };
  } catch (error) {
    console.log(error);
    return {
      session: null,
    };
  }
});
