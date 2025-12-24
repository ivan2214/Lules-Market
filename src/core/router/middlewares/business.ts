import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { business } from "@/db/schema";
import { requiredAuthMiddleware } from "./auth";

export const requiredBusinessMiddleware = requiredAuthMiddleware.concat(
  async ({ context, next }) => {
    try {
      const businessFound = await db.query.business.findFirst({
        where: eq(business.userId, context.user.id),
        with: {
          logo: true,
          coverImage: true,
          currentPlan: true,
        },
      });

      if (!businessFound) {
        return redirect("/api/auth/signin");
      }
      return next({
        context: {
          business: businessFound,
        },
      });
    } catch (error) {
      console.error("Error checking business authorization:", error);
      throw new ORPCError("UNAUTHORIZED");
    }
  },
);
