import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { verifySession } from "./verify-session";

export const requireUser = cache(
  async (): Promise<{
    isAuth: boolean;
    userId: string;
    email: string;
    name: string;
  }> => {
    const session = await verifySession();
    if (!session.isAuth) redirect("/auth/signin");
    return session;
  },
);
