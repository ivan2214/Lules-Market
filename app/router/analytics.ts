import "server-only";
import { os } from "@orpc/server";
import { z } from "zod";
import type { Product } from "@/db/types";
import {
  getHomePageStatsCache,
  getProductStatsCache,
  getStatsCache,
} from "./cache-functions/analytics";
import { businessAuthorized } from "./middlewares/authorized";

const AnalyticsPeriodSchema = z.enum(["7d", "30d", "90d"]).default("30d");

export type AnalyticsPeriod = z.infer<typeof AnalyticsPeriodSchema>;

export const getHomePageStats = os
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

export const getStats = businessAuthorized
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
    return getStatsCache(context.business.id, input);
  });

export const getProductStats = businessAuthorized
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
    return getProductStatsCache(context.business.id, input);
  });

export const analyticsRoute = {
  getStats,
  getProductStats,
  getHomePageStats,
};
