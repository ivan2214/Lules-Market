import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

export const getCurrentUser = cache(
  async (): Promise<{
    id: string;
    email: string;
    name: string;
  } | null> => {
    const session = await verifySession();
    if (!session) return null;
    try {
      const data = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      if (!data) return null;
      return {
        id: data.id,
        email: data.email ?? "",
        name: data.name ?? "",
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },
);

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
