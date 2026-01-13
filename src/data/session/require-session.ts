"use server";

import type { User } from "better-auth";
import { getCurrentSession } from "./get-current-session";

export const requireSession = async (): Promise<{
  user: User;
}> => {
  try {
    const { session } = await getCurrentSession();

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
