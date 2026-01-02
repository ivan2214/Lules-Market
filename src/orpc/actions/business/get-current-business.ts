"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { business as businessSchema } from "@/db/schema";
import { actionContext, oa } from "@/orpc/middlewares";
import { requireBusiness } from "./require-business";

export const getCurrentBusiness = oa
  .handler(async () => {
    const [error, result] = await requireBusiness();

    if (error || !result) {
      throw error;
    }

    const business = await db.query.business.findFirst({
      where: eq(businessSchema.userId, result.userId),
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
      },
    });

    if (!business) {
      throw new Error("Business not found");
    }

    return {
      currentBusiness: business,
    };
  })
  .actionable({
    context: actionContext,
  });
