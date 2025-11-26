import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireUser } from "../user/require-user";
import type { BusinessDTO } from "./business.dto";

export const requireBusiness = cache(async () => {
  await connection();

  const session = await requireUser();

  const business = await prisma.business.findUnique({
    where: { userId: session.userId },
    include: {
      logo: true,
      coverImage: true,
      category: true,
      user: {
        include: {
          admin: true,

          business: true,
        },
      },
      products: {
        include: {
          images: true,
        },
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  const isAdmin = await prisma.admin.findUnique({
    where: { userId: session.userId },
  });

  if (isAdmin) {
    redirect("/admin");
  }

  if (!business) {
    redirect("/auth/business-setup");
  }

  return {
    userId: session.userId,
    business,
  };
});

export const getCurrentBusiness = cache(
  async (): Promise<{
    currentBusiness: BusinessDTO;
  }> => {
    const { business } = await requireBusiness();

    return {
      currentBusiness: business,
    };
  },
);
