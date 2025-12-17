import { ORPCError } from "@orpc/server";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { db, type Product, schema } from "@/db";
import { businessAuthorized } from "./middlewares/authorized";

const AnalyticsPeriodSchema = z.enum(["7d", "30d", "90d"]).default("30d");

export type AnalyticsPeriod = z.infer<typeof AnalyticsPeriodSchema>;

import { os } from "@orpc/server";
import { startOfMonth, subMonths } from "date-fns";
import { business, product } from "@/db/schema";

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
    const now = new Date();
    const startThisMonth = startOfMonth(now);
    const startLastMonth = startOfMonth(subMonths(now, 1));
    const endLastMonth = startThisMonth;
    const [
      activeBusinessesTotal,
      activeBusinessesLastMonth,
      productsTotal,
      productsLastMonth,
    ] = await Promise.all([
      // Total de negocios activos
      db
        .select({ count: count() })
        .from(business)
        .where(and(eq(business.isActive, true), eq(business.isBanned, false))),
      // Negocios activos creados el mes pasado
      db
        .select({ count: count() })
        .from(business)
        .where(
          and(
            eq(business.isActive, true),
            eq(business.isBanned, false),
            gte(business.createdAt, startLastMonth),
            lt(business.createdAt, endLastMonth),
          ),
        ),
      // Total de productos activos
      db
        .select({ count: count() })
        .from(product)
        .where(and(eq(product.active, true), eq(product.isBanned, false))),
      // Productos activos creados el mes pasado
      db
        .select({ count: count() })
        .from(product)
        .where(
          and(
            eq(product.active, true),
            eq(product.isBanned, false),
            gte(product.createdAt, startLastMonth),
            lt(product.createdAt, endLastMonth),
          ),
        ),
    ]);
    return {
      activeBusinessesTotal: activeBusinessesTotal[0].count,
      activeBusinessesLastMonth: activeBusinessesLastMonth[0].count,
      productsTotal: productsTotal[0].count,
      productsLastMonth: productsLastMonth[0].count,
    };
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
    const { business: currentBusiness } = context;
    const period = input.period ?? "30d";

    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get product views
    const productViews = await db.query.productView.findMany({
      where: gte(schema.productView.createdAt, startDate),
      with: {
        product: {
          columns: {
            id: true,
            name: true,
            businessId: true,
          },
        },
      },
    });

    // Filter by businessId (done in memory since we need to join)
    const filteredProductViews = productViews.filter(
      (view) => view.product?.businessId === currentBusiness.id,
    );

    // Get business views
    const businessViews = await db.query.businessView.findMany({
      where: and(
        eq(schema.businessView.businessId, currentBusiness.id),
        gte(schema.businessView.createdAt, startDate),
      ),
    });

    // Calculate daily views
    const dailyViews: Record<string, number> = {};
    const allViews = [
      ...filteredProductViews.map((v) => ({ ...v, type: "product" as const })),
      ...businessViews.map((v) => ({ ...v, type: "business" as const })),
    ];

    for (const view of allViews) {
      const date = view.createdAt.toISOString().split("T")[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    }

    // Fill missing dates with 0
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      if (!dailyViews[dateStr]) {
        dailyViews[dateStr] = 0;
      }
    }

    // Sort by date
    const sortedDailyViews = Object.entries(dailyViews)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views }));

    // Top products
    const productViewCounts: Record<string, { name: string; count: number }> =
      {};
    for (const view of filteredProductViews) {
      if (view.product) {
        if (!productViewCounts[view.product.id]) {
          productViewCounts[view.product.id] = {
            name: view.product.name,
            count: 0,
          };
        }
        productViewCounts[view.product.id].count++;
      }
    }

    const topProducts = Object.entries(productViewCounts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);

    // Referrer stats
    const referrerCounts: Record<string, number> = {};
    for (const view of allViews) {
      const referrer = view.referrer || "Directo";
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
    }

    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalViews: allViews.length,
      productViews: filteredProductViews.length,
      businessViews: businessViews.length,
      dailyViews: sortedDailyViews,
      topProducts,
      topReferrers,
    };
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
    const { business: currentBusiness } = context;
    const period = input.period ?? "30d";
    const productId = input.productId;

    // Verify product belongs to business
    const product = await db.query.product.findFirst({
      where: and(
        eq(schema.product.id, input.productId),
        eq(schema.product.businessId, currentBusiness.id),
      ),
    });

    if (!product) {
      throw new ORPCError("NOT_FOUND", { message: "Producto no encontrado" });
    }

    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const views = await db.query.productView.findMany({
      where: and(
        eq(schema.productView.productId, productId),
        gte(schema.productView.createdAt, startDate),
      ),
    });

    // Calculate daily views
    const dailyViews: Record<string, number> = {};

    for (const view of views) {
      const date = view.createdAt.toISOString().split("T")[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    }

    // Fill missing dates
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      if (!dailyViews[dateStr]) {
        dailyViews[dateStr] = 0;
      }
    }

    const sortedDailyViews = Object.entries(dailyViews)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views }));

    return {
      product,
      totalViews: views.length,
      dailyViews: sortedDailyViews,
    };
  });

export const analyticsRoute = {
  getStats,
  getProductStats,
  getHomePageStats,
};
