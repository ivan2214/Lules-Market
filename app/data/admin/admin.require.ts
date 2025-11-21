import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getCurrentUser, requireUser } from "@/app/data/user/require-user";
import prisma from "@/lib/prisma";

export const requireAdmin = cache(async () => {
  const session = await requireUser();

  const admin = await prisma.admin.findUnique({
    where: { userId: session.userId },
  });

  if (!admin) {
    redirect("/auth/signin");
  }

  return { session, admin };
});

export const getCurrentAdmin = async () => {
  try {
    const user = await getCurrentUser();
    const admin = await prisma.admin.findUnique({
      where: {
        userId: user?.id,
      },
      include: {
        user: true,
      },
    });

    return admin;
  } catch {
    return null;
  }
};
