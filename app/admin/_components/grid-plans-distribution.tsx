"use client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { orpcTanstack } from "@/lib/orpc";

export const GridPlansDistribution = () => {
  const {
    data: { planDistribution },
    isError,
  } = useSuspenseQuery(orpcTanstack.admin.getAnalyticsData.queryOptions());

  if (isError) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(["FREE", "BASIC", "PREMIUM"] as const).map((plan) => (
        <div key={plan} className="space-y-2">
          <p className="font-medium text-muted-foreground text-sm">
            Plan {plan}
          </p>
          <p className="font-bold text-3xl">{planDistribution[plan].value}</p>
          <p className="text-muted-foreground text-xs">
            {planDistribution[plan].percentage.toFixed(1)}% del total
          </p>
        </div>
      ))}
    </div>
  );
};
