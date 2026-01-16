import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { AnalyticsService } from "@/server/modules/analytics/service";

export async function getHomePageStats() {
  "use cache";
  cacheTag("analytics", "home-page-stats");
  cacheLife("minutes");

  return await AnalyticsService.getHomePageStats();
}

export async function getAnalyticsStats(
  businessId: string,
  period?: "7d" | "30d" | "90d",
) {
  return await AnalyticsService.getStats(businessId, period);
}

export async function getProductAnalyticsStats(
  productId: string,
  businessId: string,
  period?: "7d" | "30d" | "90d",
) {
  return await AnalyticsService.getProductStats({
    businessId,
    productId,
    period,
  });
}
