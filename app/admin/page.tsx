import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Package,
  Store,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { BusinessGrowthChart } from "@/components/admin/business-growth-chart";

import { RevenueChart } from "@/components/admin/revenue-chart";
import { StatCard } from "@/components/admin/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { orpc } from "@/lib/orpc";

export default async function AdminDashboard() {
  const [{ stats }, { planDistribution, monthlyData, businessGrowthData }] =
    await Promise.all([
      orpc.admin.getAdminDashboardStats(),
      orpc.admin.getAnalyticsData(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Dashboard de Admin
        </h1>
        <p className="text-muted-foreground">
          Vista general de estadísticas y métricas del sistema
        </p>
      </div>

      {/* Stats principales */}
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

      {/* Pagos */}
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

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <BusinessGrowthChart data={businessGrowthData} />
        <RevenueChart data={monthlyData} />
      </div>

      {/* Trials */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Trials Activos"
          value={stats.trials.actives}
          icon={TrendingUp}
          className="border-blue-200 dark:border-blue-900"
        />
      </div>

      {/* Distribución de planes */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Planes</CardTitle>
          <CardDescription>Negocios por tipo de plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {(["FREE", "BASIC", "PREMIUM"] as const).map((plan) => (
              <div key={plan} className="space-y-2">
                <p className="font-medium text-muted-foreground text-sm">
                  Plan {plan}
                </p>
                <p className="font-bold text-3xl">
                  {planDistribution[plan].value}
                </p>
                <p className="text-muted-foreground text-xs">
                  {planDistribution[plan].percentage.toFixed(1)}% del total
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
