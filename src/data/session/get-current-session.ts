"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { auth, type Session } from "@/lib/auth";

export const getCurrentSession = cache(
  async (): Promise<{
    session: Session | null;
  }> => {
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
  },
);
