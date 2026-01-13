import "server-only";
import { ORPCError } from "@orpc/server"; /* Using ORPCError as generic AppError equivalent or replace with AppError if preferred, keeping existing logic */
import { startOfMonth, subMonths } from "date-fns";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import {
  business,
  businessView as businessViewSchema,
  product,
  product as productSchema,
  productView as productViewSchema,
} from "@/db/schema";
import { CACHE_KEYS, CACHE_TTL, getCachedOrFetch } from "@/lib/cache";
import type { AnalyticsModel } from "./model";

type HomePageStats = {
  activeBusinessesTotal: number;
  activeBusinessesLastMonth: number;
  productsTotal: number;
  productsLastMonth: number;
};

export abstract class AnalyticsService {
  private static async fetchHomePageStats(): Promise<HomePageStats> {
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
      db
        .select({ count: count() })
        .from(business)
        .where(and(eq(business.isActive, true))),
      db
        .select({ count: count() })
        .from(business)
        .where(
          and(
            eq(business.isActive, true),
            gte(business.createdAt, startLastMonth),
            lt(business.createdAt, endLastMonth),
          ),
        ),
      db
        .select({ count: count() })
        .from(product)
        .where(and(eq(product.active, true))),
      db
        .select({ count: count() })
        .from(product)
        .where(
          and(
            eq(product.active, true),
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
  }

  static async getHomePageStats(): Promise<HomePageStats> {
    return getCachedOrFetch(
      CACHE_KEYS.HOMEPAGE_STATS,
      AnalyticsService.fetchHomePageStats,
      CACHE_TTL.HOMEPAGE_STATS,
    );
  }

  static async getStats(
    businessId: string,
    period?: AnalyticsModel.AnalyticsPeriod,
  ) {
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const productViews = await db.query.productView.findMany({
      where: gte(productViewSchema.createdAt, startDate),
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

    const filteredProductViews = productViews.filter(
      (view) => view.product?.businessId === businessId,
    );

    const businessViews = await db.query.businessView.findMany({
      where: and(
        eq(businessViewSchema.businessId, businessId),
        gte(businessViewSchema.createdAt, startDate),
      ),
    });

    const dailyViews: Record<string, number> = {};
    const allViews = [
      ...filteredProductViews.map((v) => ({ ...v, type: "product" as const })),
      ...businessViews.map((v) => ({ ...v, type: "business" as const })),
    ];

    for (const view of allViews) {
      const date = view.createdAt.toISOString().split("T")[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    }

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
  }

  static async getProductStats({
    businessId,
    period,
    productId,
  }: {
    businessId: string;
    period?: AnalyticsModel.AnalyticsPeriod;
    productId: string;
  }) {
    const productData = await db.query.product.findFirst({
      where: and(
        eq(productSchema.id, productId),
        eq(productSchema.businessId, businessId),
      ),
    });

    if (!productData) {
      throw new ORPCError("NOT_FOUND", { message: "Producto no encontrado" });
    }

    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const views = await db.query.productView.findMany({
      where: and(
        eq(productViewSchema.productId, productId),
        gte(productViewSchema.createdAt, startDate),
      ),
    });

    const dailyViews: Record<string, number> = {};

    for (const view of views) {
      const date = view.createdAt.toISOString().split("T")[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    }

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
      product: productData,
      totalViews: views.length,
      dailyViews: sortedDailyViews,
    };
  }
}
