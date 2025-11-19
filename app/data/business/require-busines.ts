import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireUser } from "../user/require-user";
import type { BusinessDTO } from "./business.dto";

export const requireBusiness = cache(
  async (): Promise<{
    userId: string;
    email: string;
    business: BusinessDTO;
    name: string;
  }> => {
    await connection();

    const session = await requireUser();

    const business = await prisma.business.findUnique({
      where: { userId: session.userId },
      include: {
        logo: true,
        coverImage: true,
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

    if (!business) {
      redirect("/auth/business-setup");
    }

    if (!business) {
      redirect("/auth/business-setup");
    }

    return {
      userId: session.userId,
      email: session.email,
      business,
      name: session.name,
    };
  },
);
