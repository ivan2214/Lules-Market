import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireUser } from "../user/require-user";
import type { BusinessDTO } from "./business.dto";

export const requireBusiness = cache(
  async (): Promise<{
    session: {
      id: string;
      email: string;
      name: string;
      token: string;
    };
    business: BusinessDTO;
  }> => {
    const session = await requireUser();

    const isAdmin = await prisma.admin.findUnique({
      where: {
        userId: session.id,
      },
    });

    const business = await prisma.business.findUnique({
      where: { userId: session.id },
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

    if (!business && !isAdmin) {
      redirect("/auth/business-setup");
    }

    if (!business) {
      redirect("/auth/business-setup");
    }

    return { session, business };
  },
);
