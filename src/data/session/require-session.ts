"use server";

import type { User } from "better-auth";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const requireSession = async (): Promise<{
  user: User;
}> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.session || !session?.user) {
      throw new Error("UNAUTHORIZED");
    }

    return {
      user: session.user,
    };
  } catch (error) {
    console.log(error);
    throw new Error("UNAUTHORIZED");
  }
};
