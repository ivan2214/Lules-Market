import "server-only";

import { and, eq, gte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import { getCurrentBusiness } from "../business/require-busines";
import type { AnalyticsPeriod } from "./analytics.dto";

// ========================================
// FUNCIONES PRIVADAS (Requieren autenticación)
// ========================================

export async function getAnalytics(
  period: AnalyticsPeriod = "30d",
  businessId: string,
) {
  "use cache";
  cacheLife("minutes");
  cacheTag("analytics");

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

export async function getProductAnalytics(
  productId: string,
  period: AnalyticsPeriod = "30d",
) {
  const { currentBusiness } = await getCurrentBusiness();

  // Verify product belongs to business
  const product = await db.query.product.findFirst({
    where: and(
      eq(schema.product.id, productId),
      eq(schema.product.businessId, currentBusiness.id),
    ),
  });

  if (!product) {
    throw new Error("Producto no encontrado");
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
