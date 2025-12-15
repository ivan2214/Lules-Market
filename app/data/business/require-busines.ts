import "server-only";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import type { BusinessWithRelations } from "@/db";
import { db, schema } from "@/db";
import { requireUser } from "../user/require-user";

export const requireBusiness = cache(async () => {
  await connection();

  const session = await requireUser();

  const business = await db.query.business.findFirst({
    where: eq(schema.business.userId, session.userId),
    with: {
      logo: true,
      coverImage: true,
      category: true,
      user: {
        with: {
          admin: true,
          business: true,
        },
      },
      products: {
        where: eq(schema.product.active, true),
        orderBy: [
          desc(schema.product.featured),
          desc(schema.product.createdAt),
        ],
        with: {
          images: true,
        },
      },
      currentPlan: {
        with: {
          plan: true,
        },
      },
    },
  });

  const isAdmin = await db.query.admin.findFirst({
    where: eq(schema.admin.userId, session.userId),
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
    currentBusiness: BusinessWithRelations;
  }> => {
    const { business } = await requireBusiness();

    return {
      currentBusiness: business,
    };
  },
);
