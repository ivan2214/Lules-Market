import "server-only";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import z from "zod";
import {
  featuredBusinessesCache,
  getBusinessByIdCache,
  ListAllBusinessesInputSchema,
  ListAllBusinessesOutputSchema,
  listAllBusinessesCache,
  listAllSimilarBusinessesCache,
} from "@/core/cache-functions/business";
import { db } from "@/db";
import {
  business as businessSchema,
  businessView,
  category as categorySchema,
  currentPlan as currentPlanSchema,
  image as imageSchema,
  plan as planSchema,
  trial as trialSchema,
  user as userSchema,
} from "@/db/schema";
import type { Business, BusinessWithRelations } from "@/db/types";
import { env } from "@/env/server";
import { CACHE_KEYS, invalidateCache } from "@/lib/cache";
import { o } from "@/orpc/context";
import { BusinessSetupSchema } from "@/shared/validators/business";

export const businessSetup = o
  .route({
    method: "POST",
    description: "Setup business",
    summary: "Setup business",
    tags: ["Business"],
  })
  .input(
    BusinessSetupSchema.extend({
      userEmail: z.string(),
    }),
  )
  .output(
    z.object({
      success: z.boolean(),
      business: z.custom<Business>(),
    }),
  )
  .handler(async ({ input }) => {});

export const businessPublicRouter = {
  businessSetup,
};
