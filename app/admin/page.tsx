import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Package,
  Store,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { BusinessGrowthChart } from "@/components/admin/business-growth-chart";
import { PlanDistributionChart } from "@/components/admin/plan-distribution-chart";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { StatCard } from "@/components/admin/stat-card";
import { mockAnalytics, mockDashboardStats } from "@/lib/data/mock-data";

export default function AdminDashboard() {
  const stats = mockDashboardStats;
  const analytics = mockAnalytics;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vista general de estadísticas y métricas del sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Usuarios"
          value={stats.users.total}
          description={`${stats.users.active} activos, ${stats.users.banned} baneados`}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Negocios"
          value={stats.businesses.total}
          description={`${stats.businesses.active} activos, ${stats.businesses.banned} baneados`}
          icon={Store}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Productos"
          value={stats.products.total}
          description={`${stats.products.active} activos, ${stats.products.banned} baneados`}
          icon={Package}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${(stats.payments.totalRevenue / 1000).toFixed(0)}k`}
          description={`${stats.payments.approved} pagos aprobados`}
          icon={CreditCard}
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Payment Stats */}
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

      {/* Plan Distribution */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Plan FREE"
          value={stats.plans.FREE}
          description="Negocios en plan gratuito"
          icon={TrendingUp}
        />
        <StatCard
          title="Plan BASIC"
          value={stats.plans.BASIC}
          description="Negocios en plan básico"
          icon={TrendingUp}
        />
        <StatCard
          title="Plan PREMIUM"
          value={stats.plans.PREMIUM}
          description="Negocios en plan premium"
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={analytics.monthlyRevenue} />
        <BusinessGrowthChart data={analytics.businessGrowth} />
      </div>

      <PlanDistributionChart data={analytics.planDistribution} />
    </div>
  );
}
