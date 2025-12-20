"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { orpcTanstack } from "@/lib/orpc";
import { StatCard } from "./stat-card";

export const GridPayments = () => {
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
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Pagos Aprobados"
        value={stats.payments.approved}
        icon={CheckCircle}
        className="border-green-200 dark:border-green-900"
      />
      <StatCard
        title="Pagos Pendientes"
        value={stats.payments.pending}
        icon={AlertCircle}
        className="border-yellow-200 dark:border-yellow-900"
      />
      <StatCard
        title="Pagos Rechazados"
        value={stats.payments.rejected}
        icon={XCircle}
        className="border-red-200 dark:border-red-900"
      />
    </div>
  );
};
