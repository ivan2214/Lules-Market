import "server-only";
import { ORPCError } from "@orpc/server";
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
import type { AnalyticsPeriod } from "@/server/routers/analytics";

type HomePageStats = {
  activeBusinessesTotal: number;
  activeBusinessesLastMonth: number;
  productsTotal: number;
  productsLastMonth: number;
};

async function fetchHomePageStats(): Promise<HomePageStats> {
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
      .where(and(eq(business.isActive, true))),
    // Negocios activos creados el mes pasado
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
    // Total de productos activos
    db
      .select({ count: count() })
      .from(product)
      .where(and(eq(product.active, true))),
    // Productos activos creados el mes pasado
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

export async function getHomePageStatsCache(): Promise<HomePageStats> {
  return getCachedOrFetch(
    CACHE_KEYS.HOMEPAGE_STATS,
    fetchHomePageStats,
    CACHE_TTL.HOMEPAGE_STATS,
  );
}

export async function getStatsCache(
  businessId: string,
  period?: AnalyticsPeriod,
) {
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get product views
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

  // Filter by businessId (done in memory since we need to join)
  const filteredProductViews = productViews.filter(
    (view) => view.product?.businessId === businessId,
  );

  // Get business views
  const businessViews = await db.query.businessView.findMany({
    where: and(
      eq(businessViewSchema.businessId, businessId),
      gte(businessViewSchema.createdAt, startDate),
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
  const productViewCounts: Record<string, { name: string; count: number }> = {};
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
}

export async function getProductStatsCache({
  businessId,
  period,
  productId,
}: {
  businessId: string;
  period?: AnalyticsPeriod;
  productId: string;
}) {
  // Verify product belongs to business
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
    product: productData,
    totalViews: views.length,
    dailyViews: sortedDailyViews,
  };
}
