import { getAnalytics } from "@/app/data/analytics/analytics.dal";
import type { AnalyticsPeriod } from "@/app/data/analytics/analytics.dto";
import { getCurrentBusiness } from "@/app/data/business/require-busines";

import { AnalyticsContent } from "@/components/dashboard/analytics/analytics-content";

type AnalyticsData = {
  totalViews: number;
  productViews: number;
  businessViews: number;
  dailyViews: Array<{ date: string; views: number }>;
  topProducts: Array<{ id: string; name: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
};

const DEFAULT_ANALYTICS: AnalyticsData = {
  totalViews: 0,
  productViews: 0,
  businessViews: 0,
  dailyViews: [],
  topProducts: [],
  topReferrers: [],
};

export async function AnalyticsData({ period }: { period: AnalyticsPeriod }) {
  try {
    // Get business and subscription info
    const { currentBusiness } = await getCurrentBusiness();

    if (!currentBusiness) {
      console.error("Business not found");
      return (
        <AnalyticsContent
          period={period}
          data={DEFAULT_ANALYTICS}
          hasStatistics={false}
        />
      );
    }

    const currentPlan = currentBusiness.currentPlan;

    // If no stats available, return early with default data
    if (!currentPlan) {
      return (
        <AnalyticsContent
          period={period}
          data={DEFAULT_ANALYTICS}
          hasStatistics={false}
        />
      );
    }

    // Fetch analytics data
    let data: AnalyticsData;
    try {
      const analytics = await getAnalytics(period, currentBusiness.id);
      data = {
        totalViews: analytics?.totalViews ?? 0,
        productViews: analytics?.productViews ?? 0,
        businessViews: analytics?.businessViews ?? 0,
        dailyViews: analytics?.dailyViews ?? [],
        topProducts: analytics?.topProducts ?? [],
        topReferrers: analytics?.topReferrers ?? [],
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Return default data on error but still show the UI
      data = { ...DEFAULT_ANALYTICS };
    }

    return (
      <AnalyticsContent
        period={period}
        data={data}
        hasStatistics={currentPlan?.hasStatistics}
      />
    );
  } catch (error) {
    console.error("Error in AnalyticsData component:", error);
    // Show a more specific error state
    return (
      <div className="rounded-lg border bg-destructive/10 p-6 text-destructive">
        <h3 className="mb-2 font-semibold">Error al cargar las estadísticas</h3>
        <p>Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    );
  }
}
