import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const getCurrentUser = async (): Promise<{
  id: string;
  email: string;
  name: string;
  token: string;
} | null> => {
  "use cache: private";

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
};

export const requireUser = async () => {
  "use cache: private";

  const user = await getCurrentUser();

  const userDB = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  const isValidSession = userDB && user;

  if (!isValidSession) {
    redirect("/auth/signin");
  }
  return user;
};
