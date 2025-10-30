import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DiscIcon,
  Package,
  Store,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { cacheLife } from "next/cache";
import { BusinessGrowthChart } from "@/components/admin/business-growth-chart";
import { PlanDistributionChart } from "@/components/admin/plan-distribution-chart";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { StatCard } from "@/components/admin/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import type { Analytics } from "@/types";

// ====================== 📘 Tipos auxiliares ======================

interface Trend {
  percentage: number;
  isPositive: boolean;
}

interface RevenueTrend extends Trend {}

interface StatGroup {
  total: number;
  active: number;
  banned: number;
  trend: Trend;
}

interface PaymentStats {
  approved: number;
  pending: number;
  rejected: number;
  totalRevenue: {
    total: number;
    trend: RevenueTrend;
  };
}

interface DashboardStats {
  businesses: StatGroup;
  products: StatGroup;
  payments: PaymentStats;
  trials: { actives: number };
  coupons: { actives: number };
}

// ====================== ⚙️ Helpers ======================

const calcTrend = (current: number, prev: number): number => {
  if (prev === 0) return current > 0 ? 100 : 0;
  return ((current - prev) / prev) * 100;
};

const buildTrend = (current: number, prev: number): Trend => ({
  percentage: round(calcTrend(current, prev)),
  isPositive: current >= prev,
});

const round = (n: number, decimals = 2): number => {
  return Number.isFinite(n) ? +n.toFixed(decimals) : 0;
};

// ====================== 📊 Stats principales ======================

export async function getAdminDashboardStats(): Promise<{
  stats: DashboardStats;
}> {
  const now = new Date();

  const startCurrentMonth = startOfMonth(now);
  const endCurrentMonth = addMonths(startCurrentMonth, 1);
  const startLastMonth = startOfMonth(subMonths(now, 1));
  const endLastMonth = startCurrentMonth;

  const [
    totalBusinesses,
    bannedBusinesses,
    bannedProducts,
    totalProducts,
    totalApprovedPayments,
    totalPendingPayments,
    totalRejectedPayments,
    trialsActives,
    couponsActives,
    businessesCurrentMonth,
    productsCurrentMonth,
    paymentsCurrentMonthAgg,
    businessesLastMonth,
    productsLastMonth,
    paymentsLastMonthAgg,
  ] = await prisma.$transaction([
    prisma.business.count(),
    prisma.business.count({ where: { bannedBusiness: { isNot: null } } }),
    prisma.product.count({ where: { bannedProduct: { isNot: null } } }),
    prisma.product.count(),
    prisma.payment.count({ where: { status: "approved" } }),
    prisma.payment.count({ where: { status: "pending" } }),
    prisma.payment.count({ where: { status: "rejected" } }),
    prisma.trial.count({ where: { isActive: true } }),
    prisma.coupon.count({ where: { active: true } }),

    prisma.business.count({ where: { createdAt: { gte: startCurrentMonth } } }),
    prisma.product.count({ where: { createdAt: { gte: startCurrentMonth } } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "approved",
        createdAt: { gte: startCurrentMonth, lt: endCurrentMonth },
      },
    }),

    // Mes anterior

    prisma.business.count({
      where: { createdAt: { gte: startLastMonth, lt: endLastMonth } },
    }),
    prisma.product.count({
      where: { createdAt: { gte: startLastMonth, lt: endLastMonth } },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "approved",
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),
  ]);

  const currentRevenue = paymentsCurrentMonthAgg._sum.amount ?? 0;
  const lastRevenue = paymentsLastMonthAgg._sum.amount ?? 0;

  const stats: DashboardStats = {
    businesses: {
      total: totalBusinesses,
      active: totalBusinesses - bannedBusinesses,
      banned: bannedBusinesses,
      trend: buildTrend(businessesCurrentMonth, businessesLastMonth),
    },
    products: {
      total: totalProducts,
      active: totalProducts - bannedProducts,
      banned: bannedProducts,
      trend: buildTrend(productsCurrentMonth, productsLastMonth),
    },
    payments: {
      approved: totalApprovedPayments,
      pending: totalPendingPayments,
      rejected: totalRejectedPayments,
      totalRevenue: {
        total: currentRevenue,
        trend: buildTrend(currentRevenue, lastRevenue),
      },
    },
    trials: { actives: trialsActives },
    coupons: { actives: couponsActives },
  };

  return { stats };
}

// ====================== 📈 Analytics ======================

async function getAnalyticsData(): Promise<{
  planDistribution: Analytics["planDistribution"];
  monthlyData: Analytics["monthlyRevenue"];
  businessGrowthData: Analytics["businessGrowth"];
}> {
  const [free, basic, premium] = await prisma.$transaction([
    prisma.business.count({ where: { plan: "FREE" } }),
    prisma.business.count({ where: { plan: "BASIC" } }),
    prisma.business.count({ where: { plan: "PREMIUM" } }),
  ]);

  const totalPlans = free + basic + premium || 1;
  const planDistribution: Analytics["planDistribution"] = {
    FREE: { value: free, percentage: round((free / totalPlans) * 100) },
    BASIC: { value: basic, percentage: round((basic / totalPlans) * 100) },
    PREMIUM: {
      value: premium,
      percentage: round((premium / totalPlans) * 100),
    },
  };

  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

  const [monthlyPayments, businessByMonth] = await prisma.$transaction([
    prisma.payment.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: sixMonthsAgo }, status: "approved" },
      _sum: { amount: true }, // ¡CORRECCIÓN AQUÍ!
      orderBy: {
        createdAt: "asc", // o 'desc', según necesites ordenar los grupos por fecha
      },
    }),
    prisma.business.groupBy({
      by: ["createdAt"],
      where: { createdAt: { gte: sixMonthsAgo } },
      _count: { _all: true },
      // ¡CORRECCIÓN AQUÍ!
      orderBy: {
        createdAt: "asc", // o 'desc', según necesites ordenar los grupos por fecha
      },
    }),
  ]);

  // 🔹 Revenue mensual
  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM");
    const revenue =
      monthlyPayments
        .filter(
          (p) =>
            format(startOfMonth(p.createdAt), "MMM") === month &&
            p._sum?.amount,
        )
        .reduce((acc, p) => acc + (p._sum?.amount || 0), 0) || 0;

    return { month, revenue };
  });

  const last = monthlyRevenue.at(-1);
  const current = last ? last.revenue : 0;
  const previous = monthlyRevenue.at(-2)?.revenue ?? 0;

  const monthlyData: Analytics["monthlyRevenue"] = {
    data: monthlyRevenue,
    trend: current > previous ? "up" : current < previous ? "down" : "stable",
    percentage: round(calcTrend(current, previous)),
  };

  // 🔹 Crecimiento de negocios
  const businessGrowth = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM");
    const count =
      businessByMonth
        .filter(
          (b) => format(startOfMonth(b.createdAt), "MMM") === month && b._count,
        )
        .reduce(
          (acc, b) =>
            acc +
            (typeof b._count === "object" && b._count?._all
              ? b._count._all
              : 0),
          0,
        ) || 0;

    return { month, count };
  });

  const lastBusiness = businessGrowth.at(-1);
  const currentBusiness = lastBusiness ? lastBusiness.count : 0;
  const prevBusiness = businessGrowth.at(-2)?.count ?? 0;

  const businessGrowthData: Analytics["businessGrowth"] = {
    data: businessGrowth,
    trend:
      currentBusiness > prevBusiness
        ? "up"
        : currentBusiness < prevBusiness
          ? "down"
          : "stable",
    percentage: round(calcTrend(currentBusiness, prevBusiness)),
  };

  return { planDistribution, monthlyData, businessGrowthData };
}

// ====================== 🧩 Componente principal ======================

export default async function AdminDashboard() {
  "use cache";
  cacheLife("seconds");

  const [{ stats }, analytics] = await Promise.all([
    getAdminDashboardStats(),
    getAnalyticsData(),
  ]);

  const { planDistribution, monthlyData, businessGrowthData } = analytics;

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
        <PlanDistributionChart data={planDistribution} />
      </div>

      {/* Trials y Cupones */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Trials Activos"
          value={stats.trials.actives}
          icon={TrendingUp}
          className="border-blue-200 dark:border-blue-900"
        />
        <StatCard
          title="Cupones Activos"
          value={stats.coupons.actives}
          icon={DiscIcon}
          className="border-purple-200 dark:border-purple-900"
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

      <RevenueChart data={monthlyData} />
    </div>
  );
}
