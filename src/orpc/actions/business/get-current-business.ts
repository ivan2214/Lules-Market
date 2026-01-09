"use server";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { business as businessSchema } from "@/db/schema";
import { actionContext, oa } from "@/orpc/middlewares";
import { requireBusiness } from "./require-business";

export const getCurrentBusiness = oa
  .handler(async () => {
    const [error, result] = await requireBusiness();

    if (error || !result) {
      throw new ORPCError(error.message);
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
        user: true,
      },
    });

    if (!business) {
      throw new ORPCError("Business not found");
    }

    return {
      currentBusiness: business,
    };
  })
  .actionable({
    context: actionContext,
  });
