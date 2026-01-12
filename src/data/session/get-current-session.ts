"use server";

import type { Session, User } from "better-auth";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";

type CurrentSession = {
  session: Session;
  user: User;
};

export const getCurrentSession = cache(
  async (): Promise<{
    session: CurrentSession | null;
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
