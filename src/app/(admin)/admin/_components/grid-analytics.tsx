"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcTanstack } from "@/lib/orpc";
import { BusinessGrowthChart } from "./business-growth-chart";
import { RevenueChart } from "./revenue-chart";

export const GridAnalytics = () => {
  const {
    data: { businessGrowthData, monthlyData },
    isError,
  } = useSuspenseQuery(orpcTanstack.admin.getAnalyticsData.queryOptions());

  if (isError) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BusinessGrowthChart data={businessGrowthData} />
      <RevenueChart data={monthlyData} />
    </div>
  );
};
