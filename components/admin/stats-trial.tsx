"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import { orpcTanstack } from "@/lib/orpc";
import { StatCard } from "./stat-card";

export const TrialStat = () => {
  const {
    data: { stats },
    isError,
  } = useSuspenseQuery(
    orpcTanstack.admin.getAdminDashboardStats.queryOptions(),
  );

  if (isError) {
    return <p>Something went wrong</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard
        title="Trials Activos"
        value={stats.trials.actives}
        icon={TrendingUp}
        className="border-blue-200 dark:border-blue-900"
      />
    </div>
  );
};
