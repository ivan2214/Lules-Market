import "server-only";
import { ORPCError } from "@orpc/server";
import { startOfMonth, subMonths } from "date-fns";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import { business, product } from "@/db/schema";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";

export type AnalyticsPeriod = "7d" | "30d" | "90d";

export async function getHomePageStatsCache() {
  "use cache";
  cacheTag(CACHE_TAGS.ANALYTICS.HOME_PAGE_STATS);
  // revalidar cada 1 hora
  cacheLife({
    revalidate: 60 * 60,
    expire: 60 * 60 * 24,
  });
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
}

export async function getStatsCache(
  businessId: string,
  input: { period?: AnalyticsPeriod },
) {
  "use cache";
  cacheTag(CACHE_TAGS.ANALYTICS.GET_STATS);
  cacheLife({
    revalidate: 60 * 60,
    expire: 60 * 60 * 24,
  });

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
    (view) => view.product?.businessId === businessId,
  );

  // Get business views
  const businessViews = await db.query.businessView.findMany({
    where: and(
      eq(schema.businessView.businessId, businessId),
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

export async function getProductStatsCache(
  businessId: string,
  input: { period?: AnalyticsPeriod; productId: string },
) {
  "use cache";
  cacheTag(CACHE_TAGS.ANALYTICS.GET_PRODUCT_STATS(input.productId));
  cacheLife({
    revalidate: 60 * 60,
    expire: 60 * 60 * 24,
  });

  const period = input.period ?? "30d";
  const productId = input.productId;

  // Verify product belongs to business
  const product = await db.query.product.findFirst({
    where: and(
      eq(schema.product.id, productId),
      eq(schema.product.businessId, businessId),
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
}
