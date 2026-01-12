import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentBusiness } from "@/data/business/get-current-business";
import { requireBusiness } from "@/data/business/require-business";
import type { CurrentPlan } from "@/db/types";
import { PeriodSelector } from "@/features/dashboard/_components/period-selector";
import { client } from "@/orpc";
import { subscriptionErrors } from "../_constants";
import { AnalyticsContent } from "./_components/analytics-content";
import type { AnalyticsData } from "./_types";

type SearchParams = Promise<{ period?: "7d" | "30d" | "90d" }>;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const period = params.period || "30d";

  const { userId } = await requireBusiness();
  const { currentBusiness } = await getCurrentBusiness(userId);

  if (!currentBusiness) {
    redirect(pathsConfig.business.setup);
  }

  const currentPlan: CurrentPlan | null | undefined =
    currentBusiness?.currentPlan;

  if (!currentPlan) {
    redirect(
      `/dashboard/subscription?error=${subscriptionErrors.subscription_required}`,
    );
  }

  const analytics = await client.analytics.getStats({
    period,
  });

  const data: AnalyticsData = {
    totalViews: analytics?.totalViews ?? 0,
    productViews: analytics?.productViews ?? 0,
    businessViews: analytics?.businessViews ?? 0,
    dailyViews: analytics?.dailyViews ?? [],
    topProducts: analytics?.topProducts ?? [],
    topReferrers: analytics?.topReferrers ?? [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground">
            Analiza el rendimiento de tu negocio
          </p>
        </div>
        <PeriodSelector currentPeriod={period} />
      </div>
      <AnalyticsContent
        period={period}
        data={data}
        hasStatistics={currentPlan?.hasStatistics}
      />
    </div>
  );
}
