"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma";

export const clearUsersCache = async () => {
  try {
    await prisma.user.deleteMany();
    await prisma.business.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.session.deleteMany();
    await prisma.emailVerificationToken.deleteMany();
    await prisma.passwordResetToken.deleteMany();
    await prisma.account.deleteMany();
    updateTag("dev-tools");
  } catch (error) {
    console.error("Error al borrar usuarios", error);
    return {
      error: "Error al borrar usuarios",
    };
  }
};
