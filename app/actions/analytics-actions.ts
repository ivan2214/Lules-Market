"use server";

import prisma from "@/lib/prisma";
import { requireBusiness } from "../data/business/require-busines";

export async function trackProductView(productId: string, referrer?: string) {
  try {
    await prisma.productView.create({
      data: {
        productId,
        referrer,
      },
    });
  } catch (error) {
    console.error(" Error tracking product view:", error);
  }
}

export async function trackBusinessView(businessId: string, referrer?: string) {
  try {
    await prisma.businessView.create({
      data: {
        businessId,
        referrer,
      },
    });
  } catch (error) {
    console.error(" Error tracking business view:", error);
  }
}

export async function getAnalytics(period: "7d" | "30d" | "90d" = "30d") {
  const { business } = await requireBusiness();

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get product views
  const productViews = await prisma.productView.findMany({
    where: {
      product: {
        businessId: business.id,
      },
      createdAt: {
        gte: startDate,
      },
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Get business views
  const businessViews = await prisma.businessView.findMany({
    where: {
      businessId: business.id,
      createdAt: {
        gte: startDate,
      },
    },
  });

  // Calculate daily views
  const dailyViews: Record<string, number> = {};
  const allViews = [...productViews, ...businessViews];

  allViews.forEach((view) => {
    const date = view.createdAt.toISOString().split("T")[0];
    dailyViews[date] = (dailyViews[date] || 0) + 1;
  });

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
  productViews.forEach((view) => {
    if (!productViewCounts[view.product.id]) {
      productViewCounts[view.product.id] = {
        name: view.product.name,
        count: 0,
      };
    }
    productViewCounts[view.product.id].count++;
  });

  const topProducts = Object.entries(productViewCounts)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Referrer stats
  const referrerCounts: Record<string, number> = {};
  allViews.forEach((view) => {
    const referrer = view.referrer || "Directo";
    referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
  });

  const topReferrers = Object.entries(referrerCounts)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalViews: allViews.length,
    productViews: productViews.length,
    businessViews: businessViews.length,
    dailyViews: sortedDailyViews,
    topProducts,
    topReferrers,
  };
}

export async function getProductAnalytics(
  productId: string,
  period: "7d" | "30d" | "90d" = "30d"
) {
  const { business } = await requireBusiness();

  // Verify product belongs to business
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      businessId: business.id,
    },
  });

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const views = await prisma.productView.findMany({
    where: {
      productId,
      createdAt: {
        gte: startDate,
      },
    },
  });

  // Calculate daily views
  const dailyViews: Record<string, number> = {};

  views.forEach((view) => {
    const date = view.createdAt.toISOString().split("T")[0];
    dailyViews[date] = (dailyViews[date] || 0) + 1;
  });

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
