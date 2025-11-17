import "server-only";
import { getCurrentUser } from "@/app/data/user/require-user";
import prisma from "@/lib/prisma";

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
