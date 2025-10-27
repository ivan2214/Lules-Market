import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? "",
    token: session.session.token,
  };
});

export const requireUser = cache(async () => {
  const user = await getCurrentUser();

  const userDB = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  const isValidSession = userDB && user;

  if (!isValidSession) {
    redirect("/auth/login");
  }
  return user;
});
