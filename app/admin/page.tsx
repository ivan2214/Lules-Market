import { format, startOfMonth, subMonths } from "date-fns";
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
import { cacheLife } from "next/cache";
import { BusinessGrowthChart } from "@/components/admin/business-growth-chart";
import { PlanDistributionChart } from "@/components/admin/plan-distribution-chart";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { StatCard } from "@/components/admin/stat-card";
import prisma from "@/lib/prisma";

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
    freePlanBusinesses,
    basicPlanBusinesses,
    premiumPlanBusinesses,
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
    prisma.business.count({ where: { plan: "FREE" } }),
    prisma.business.count({ where: { plan: "BASIC" } }),
    prisma.business.count({ where: { plan: "PREMIUM" } }),
  ]);
  const stats = {
    users: {
      total: totalUsers,
      active: totalUsers - bannedUsers,
      banned: bannedUsers,
    },
    businesses: {
      total: totalBusinesses,
      active: totalBusinesses - bannedBusinesses,
      banned: bannedBusinesses,
    },
    products: {
      total: totalProducts,
      active: totalProducts - bannedProducts,
      banned: bannedProducts,
    },
    payments: {
      totalRevenue: totalApprovedPayments,
      approved: totalApprovedPayments,
      pending: totalPendingPayments,
      rejected: totalRejectedPayments,
    },
    plans: {
      free: freePlanBusinesses,
      basic: basicPlanBusinesses,
      premium: premiumPlanBusinesses,
    },
  };
  return { stats };
}

async function getAnalyticsData() {
  // 1️⃣ Distribución de planes actuales
  const [free, basic, premium] = await Promise.all([
    prisma.business.count({ where: { plan: "FREE" } }),
    prisma.business.count({ where: { plan: "BASIC" } }),
    prisma.business.count({ where: { plan: "PREMIUM" } }),
  ]);

  const planDistribution = { FREE: free, BASIC: basic, PREMIUM: premium };

  // 2️⃣ Últimos 6 meses de ingresos
  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

  const monthlyPayments = await prisma.payment.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: { gte: sixMonthsAgo },
      status: "APPROVED",
    },
    _sum: { amount: true },
  });

  // Agrupamos por mes (ej: "Oct 2025")
  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM yyyy");
    const revenue =
      monthlyPayments
        .filter(
          (p) =>
            format(startOfMonth(p.createdAt), "MMM yyyy") === month &&
            p._sum.amount,
        )
        .reduce((acc, p) => acc + (p._sum.amount || 0), 0) || 0;

    return { month, revenue };
  });

  // 3️⃣ Crecimiento de negocios (por mes)
  const businessByMonth = await prisma.business.groupBy({
    by: ["createdAt"],
    where: { createdAt: { gte: sixMonthsAgo } },
    _count: { _all: true },
  });

  const businessGrowth = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM yyyy");
    const count =
      businessByMonth
        .filter(
          (b) =>
            format(startOfMonth(b.createdAt), "MMM yyyy") === month &&
            b._count._all,
        )
        .reduce((acc, b) => acc + b._count._all, 0) || 0;

    return { month, count };
  });

  return { planDistribution, monthlyRevenue, businessGrowth };
}
export default async function AdminDashboard() {
  "use cache";
  cacheLife("hours");
  const { stats } = await getAdminDashboardStats();
  const { planDistribution, monthlyRevenue, businessGrowth } =
    await getAnalyticsData();

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
          value={stats.plans.free}
          description="Negocios en plan gratuito"
          icon={TrendingUp}
        />
        <StatCard
          title="Plan BASIC"
          value={stats.plans.basic}
          description="Negocios en plan básico"
          icon={TrendingUp}
        />
        <StatCard
          title="Plan PREMIUM"
          value={stats.plans.premium}
          description="Negocios en plan premium"
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={monthlyRevenue} />
        <BusinessGrowthChart data={businessGrowth} />
      </div>

      <PlanDistributionChart data={planDistribution} />
    </div>
  );
}
