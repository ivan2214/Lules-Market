"use server";

import { eq } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { business as businessSchema } from "@/db/schema";
import type { BusinessWithRelations } from "@/db/types";

export const getCurrentBusiness = cache(
  async (
    userId: string,
  ): Promise<{
    currentBusiness?: BusinessWithRelations;
    success: boolean;
    error?: string;
  }> => {
    const currentBusiness = await db.query.business.findFirst({
      where: eq(businessSchema.userId, userId),
      with: {
        logo: true,
        coverImage: true,
        category: true,
        currentPlan: {
          with: {
            plan: true,
          },
        },
        products: true,
        user: true,
      },
    });

    if (!currentBusiness) {
      return {
        error: "Business not found",
        success: false,
      };
    }

    return {
      currentBusiness,
      success: true,
    };
  },
);
