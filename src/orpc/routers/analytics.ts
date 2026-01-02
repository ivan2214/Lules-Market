import "server-only";
import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  getHomePageStatsCache,
  getProductStatsCache,
  getStatsCache,
} from "@/core/cache-functions/analytics";
import { db } from "@/db";
import { business } from "@/db/schema";
import type { Product } from "@/db/types";
import { o } from "../context";
import { authMiddleware } from "../middlewares";

const AnalyticsPeriodSchema = z.enum(["7d", "30d", "90d"]).default("30d");

export type AnalyticsPeriod = z.infer<typeof AnalyticsPeriodSchema>;

export const getHomePageStats = o
  .route({
    method: "GET",
    description: "Get home page stats",
    summary: "Get home page stats",
    tags: ["Analytics"],
  })

  .output(
    z.object({
      activeBusinessesTotal: z.number(),
      activeBusinessesLastMonth: z.number(),
      productsTotal: z.number(),
      productsLastMonth: z.number(),
    }),
  )
  .handler(async () => {
    return getHomePageStatsCache();
  });

export const getStats = o
  .use(
    authMiddleware({
      role: "user",
    }),
  )
  .use(
    authMiddleware({
      role: "business",
    }),
  )
  .route({
    method: "GET",
    description: "Get stats",
    summary: "Get stats",
    tags: ["Analytics"],
  })
  .input(
    z.object({
      period: AnalyticsPeriodSchema.optional(),
    }),
  )
  .output(
    z.object({
      totalViews: z.number(),
      productViews: z.number(),
      businessViews: z.number(),
      dailyViews: z.array(z.object({ date: z.string(), views: z.number() })),
      topProducts: z.array(
        z.object({ id: z.string(), name: z.string(), count: z.number() }),
      ),
      topReferrers: z.array(
        z.object({ referrer: z.string(), count: z.number() }),
      ),
    }),
  )
  .handler(async ({ context, input }) => {
    const userId = context.user?.id;
    const businessFound = await db.query.business.findFirst({
      where: eq(business.userId, userId),
    });

    if (!businessFound) {
      throw new ORPCError("Business not found");
    }

    return getStatsCache(businessFound.id, input);
  });

export const getProductStats = o
  .use(
    authMiddleware({
      role: "user",
    }),
  )
  .use(
    authMiddleware({
      role: "business",
    }),
  )
  .route({
    method: "GET",
    description: "Get product stats",
    summary: "Get product stats",
    tags: ["Analytics"],
  })
  .input(
    z.object({
      productId: z.string(),
      period: AnalyticsPeriodSchema.optional(),
    }),
  )
  .output(
    z.object({
      product: z.custom<Product>(),
      totalViews: z.number(),
      dailyViews: z.array(z.object({ date: z.string(), views: z.number() })),
    }),
  )
  .handler(async ({ context, input }) => {
    const userId = context.user?.id;
    const businessFound = await db.query.business.findFirst({
      where: eq(business.userId, userId),
    });

    if (!businessFound) {
      throw new ORPCError("Business not found");
    }

    return getProductStatsCache(businessFound.id, input);
  });

export const analyticsRouter = {
  getStats,
  getProductStats,
  getHomePageStats,
};
