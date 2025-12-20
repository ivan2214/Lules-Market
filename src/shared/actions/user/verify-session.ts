import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
export const verifySession = cache(
  async (): Promise<{
    isAuth: boolean;
    userId: string;
    email: string;
    name: string;
  }> => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user)
        return {
          isAuth: false,
          userId: "",
          email: "",
          name: "",
        };

      return {
        isAuth: true,
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      };
    } catch (error) {
      console.error("Error verifying session:", error);
      return {
        isAuth: false,
        userId: "",
        email: "",
        name: "",
      };
    }
  },
);
