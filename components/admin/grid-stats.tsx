"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreditCard, Package, Store } from "lucide-react";
import { orpcTanstack } from "@/lib/orpc";
import { StatCard } from "./stat-card";

export const GridStats = () => {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Negocios"
        value={stats.businesses.total}
        description={`${stats.businesses.active} activos, ${stats.businesses.banned} baneados`}
        icon={Store}
        trend={stats.businesses.trend}
      />
      <StatCard
        title="Total Productos"
        value={stats.products.total}
        description={`${stats.products.active} activos, ${stats.products.banned} baneados`}
        icon={Package}
        trend={stats.products.trend}
      />
      <StatCard
        title="Ingresos Totales"
        value={`$${(stats.payments.totalRevenue.total / 1000).toFixed(0)}k`}
        description={`${stats.payments.approved} pagos aprobados`}
        icon={CreditCard}
        trend={stats.payments.totalRevenue.trend}
      />
    </div>
  );
};
