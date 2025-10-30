import { format, startOfMonth, subMonths } from "date-fns";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DiscIcon,
  Package,
  Store,
  TrendingUp,
  Users,
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

async function getAdminDashboardStats() {
  const [
    totalUsers,
    totalBusinesses,
    bannedUsers,
    bannedBusinesses,
    bannedProducts,
    totalProducts,
    totalApprovedPayments,
    totalPendingPayments,
    totalRejectedPayments,
    trialsActives,
    couponsActives,
    usersCurrentMonth,
    businessesCurrentMonth,
    productsCurrentMonth,
    paymentsApprovedCurrentMonth,
    usersLastMonth,
    businessesLastMonth,
    productsLastMonth,
    paymentsApprovedLastMonth,
  ] = await prisma.$transaction([
    prisma.user.count(),
    prisma.business.count(),
    prisma.user.count({ where: { bannedUser: { isNot: null } } }),
    prisma.business.count({ where: { bannedBusiness: { isNot: null } } }),
    prisma.product.count({ where: { bannedProduct: { isNot: null } } }),
    prisma.product.count(),
    prisma.payment.count({ where: { status: "APPROVED" } }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "REJECTED" } }),

    prisma.trial.count({ where: { isActive: true } }),
    prisma.coupon.count({ where: { active: true } }),
    /* current month */
    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth(new Date()),
        },
      },
    }),
    prisma.business.count({
      where: {
        createdAt: {
          gte: startOfMonth(new Date()),
        },
      },
    }),
    prisma.product.count({
      where: {
        createdAt: {
          gte: startOfMonth(new Date()),
        },
      },
    }),
    prisma.payment.count({
      where: {
        status: "APPROVED",
        createdAt: {
          gte: startOfMonth(new Date()),
        },
      },
    }),
    /* last month */
    prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth(subMonths(new Date(), 1)),
        },
      },
    }),
    prisma.business.count({
      where: {
        createdAt: {
          gte: startOfMonth(subMonths(new Date(), 1)),
        },
      },
    }),
    prisma.product.count({
      where: {
        createdAt: {
          gte: startOfMonth(subMonths(new Date(), 1)),
        },
      },
    }),
    prisma.payment.count({
      where: {
        status: "APPROVED",
        createdAt: {
          gte: startOfMonth(subMonths(new Date(), 1)),
        },
      },
    }),
  ]);
  const stats = {
    users: {
      total: totalUsers,
      active: totalUsers - bannedUsers,
      banned: bannedUsers,
      trend: {
        value: usersCurrentMonth - usersLastMonth,
        isPositive: usersCurrentMonth >= usersLastMonth,
      },
    },
    businesses: {
      total: totalBusinesses,
      active: totalBusinesses - bannedBusinesses,
      banned: bannedBusinesses,
      trend: {
        value: businessesCurrentMonth - businessesLastMonth,
        isPositive: businessesCurrentMonth >= businessesLastMonth,
      },
    },
    products: {
      total: totalProducts,
      active: totalProducts - bannedProducts,
      banned: bannedProducts,
      trend: {
        value: productsCurrentMonth - productsLastMonth,
        isPositive: productsCurrentMonth >= productsLastMonth,
      },
    },
    payments: {
      totalRevenue: totalApprovedPayments,
      approved: totalApprovedPayments,
      pending: totalPendingPayments,
      rejected: totalRejectedPayments,
      trend: {
        value: paymentsApprovedCurrentMonth - paymentsApprovedLastMonth,
        isPositive: paymentsApprovedCurrentMonth >= paymentsApprovedLastMonth,
      },
    },

    trials: {
      actives: trialsActives,
    },
    coupons: {
      actives: couponsActives,
    },
  };
  return { stats };
}

async function getAnalyticsData(): Promise<{
  planDistribution: Analytics["planDistribution"];
  monthlyData: Analytics["monthlyRevenue"];
  businessGrowthData: Analytics["businessGrowth"];
}> {
  // 1️⃣ Distribución de planes actuales
  const [free, basic, premium] = await prisma.$transaction([
    prisma.business.count({ where: { plan: "FREE" } }),
    prisma.business.count({ where: { plan: "BASIC" } }),
    prisma.business.count({ where: { plan: "PREMIUM" } }),
  ]);

  const planDistribution: Analytics["planDistribution"] = {
    FREE: {
      value: free,
      percentage: (free / (free + basic + premium)) * 100,
    },
    BASIC: {
      value: basic,
      percentage: (basic / (free + basic + premium)) * 100,
    },
    PREMIUM: {
      value: premium,
      percentage: (premium / (free + basic + premium)) * 100,
    },
  };

  // 2️⃣ Últimos 6 meses de ingresos
  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

  const monthlyPayments = await prisma.payment.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: { gte: sixMonthsAgo },
      status: "approved",
    },
    _sum: { amount: true },
  });

  // Agrupamos por mes (ej: "Oct 2025")
  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM");
    const revenue =
      monthlyPayments
        .filter(
          (p) =>
            format(startOfMonth(p.createdAt), "MMM") === month && p._sum.amount,
        )
        .reduce((acc, p) => acc + (p._sum.amount || 0), 0) || 0;

    return { month, revenue };
  });

  const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1].revenue;
  const previousMonthRevenue =
    monthlyRevenue[monthlyRevenue.length - 2].revenue;
  const trend =
    currentMonthRevenue > previousMonthRevenue
      ? "up"
      : currentMonthRevenue < previousMonthRevenue
        ? "down"
        : "stable";

  const percentage = (currentMonthRevenue / previousMonthRevenue) * 100;

  const monthlyData: Analytics["monthlyRevenue"] = {
    data: monthlyRevenue,
    trend,
    percentage,
  };

  // 3️⃣ Crecimiento de negocios (por mes)
  const businessByMonth = await prisma.business.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: sixMonthsAgo } },
    _count: { _all: true },
  });

  const businessGrowth = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM");
    const count =
      businessByMonth
        .filter(
          (b) =>
            format(startOfMonth(b.createdAt), "MMM") === month && b._count._all,
        )
        .reduce((acc, b) => acc + b._count._all, 0) || 0;

    return { month, count };
  });

  const currentMonthBusiness = businessGrowth[businessGrowth.length - 1].count;
  const previousMonthBusiness = businessGrowth[businessGrowth.length - 2].count;
  const businessGrowthTrend =
    currentMonthBusiness > previousMonthBusiness
      ? "up"
      : currentMonthBusiness < previousMonthBusiness
        ? "down"
        : "stable";
  const businessGrowthPercentage =
    previousMonthBusiness > 0
      ? (currentMonthBusiness / previousMonthBusiness) * 100
      : currentMonthBusiness > 0
        ? 100
        : 0;

  const businessGrowthData: Analytics["businessGrowth"] = {
    data: businessGrowth,
    trend: businessGrowthTrend,
    percentage: businessGrowthPercentage,
  };

  return { planDistribution, monthlyData, businessGrowthData };
}
export default async function AdminDashboard() {
  "use cache";
  cacheLife("seconds");
  const { stats } = await getAdminDashboardStats();
  const { planDistribution, monthlyData, businessGrowthData } =
    await getAnalyticsData();
  console.log("planDistribution", planDistribution);

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
          value={`$${(stats.payments.totalRevenue / 1000).toFixed(0)}k`}
          description={`${stats.payments.approved} pagos aprobados`}
          icon={CreditCard}
          trend={stats.payments.trend}
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

      {/* Trials and Coupons */}
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

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Planes</CardTitle>
          <CardDescription>Negocios por tipo de plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Plan FREE
              </p>
              <p className="font-bold text-3xl">
                {planDistribution.FREE.value}
              </p>
              <p className="text-muted-foreground text-xs">
                {planDistribution.FREE.percentage.toFixed(1)}% del total
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Plan BASIC
              </p>
              <p className="font-bold text-3xl">
                {planDistribution.BASIC.value}
              </p>
              <p className="text-muted-foreground text-xs">
                {planDistribution.BASIC.percentage.toFixed(1)}% del total
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Plan PREMIUM
              </p>
              <p className="font-bold text-3xl">
                {planDistribution.PREMIUM.value}
              </p>
              <p className="text-muted-foreground text-xs">
                {planDistribution.PREMIUM.percentage.toFixed(1)}% del total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <BusinessGrowthChart data={businessGrowthData} />
        <PlanDistributionChart data={planDistribution} />
      </div>
      <RevenueChart data={monthlyData} />
    </div>
  );
}
