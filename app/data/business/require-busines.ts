import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { requireUser } from "../user/require-user";

export const requireBusiness = cache(async () => {
  const session = await requireUser();

  const business = await prisma.business.findUnique({
    where: { userId: session.id },
    include: {
      logo: true,
      coverImage: true,
      user: {
        include: {
          admin: true,
          bannedUser: true,
          business: true,
        },
      },
    },
  });

  if (!business) {
    redirect("/dashboard/setup");
  }

  return { session, business };
});
