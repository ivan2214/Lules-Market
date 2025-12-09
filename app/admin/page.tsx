import { addMonths, format, startOfMonth, subMonths } from "date-fns";
import { and, count, eq, gte, lt, sum } from "drizzle-orm";
import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  Package,
  Store,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
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
import { db, schema } from "@/db";
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
    totalBusinessesResult,
    bannedBusinessesResult,
    bannedProductsResult,
    totalProductsResult,
    totalApprovedPaymentsResult,
    totalPendingPaymentsResult,
    totalRejectedPaymentsResult,
    trialsActivesResult,
    businessesCurrentMonthResult,
    productsCurrentMonthResult,
    paymentsCurrentMonthResult,
    businessesLastMonthResult,
    productsLastMonthResult,
    paymentsLastMonthResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(schema.business),
    db
      .select({ count: count() })
      .from(schema.business)
      .innerJoin(
        schema.bannedBusiness,
        eq(schema.business.id, schema.bannedBusiness.businessId),
      ),
    db
      .select({ count: count() })
      .from(schema.product)
      .innerJoin(
        schema.bannedProduct,
        eq(schema.product.id, schema.bannedProduct.productId),
      ),
    db.select({ count: count() }).from(schema.product),
    db
      .select({ count: count() })
      .from(schema.payment)
      .where(eq(schema.payment.status, "approved")),
    db
      .select({ count: count() })
      .from(schema.payment)
      .where(eq(schema.payment.status, "pending")),
    db
      .select({ count: count() })
      .from(schema.payment)
      .where(eq(schema.payment.status, "rejected")),
    db
      .select({ count: count() })
      .from(schema.trial)
      .where(eq(schema.trial.isActive, true)),
    db
      .select({ count: count() })
      .from(schema.business)
      .where(gte(schema.business.createdAt, startCurrentMonth)),
    db
      .select({ count: count() })
      .from(schema.product)
      .where(gte(schema.product.createdAt, startCurrentMonth)),
    db
      .select({ total: sum(schema.payment.amount) })
      .from(schema.payment)
      .where(
        and(
          eq(schema.payment.status, "approved"),
          gte(schema.payment.createdAt, startCurrentMonth),
          lt(schema.payment.createdAt, endCurrentMonth),
        ),
      ),
    db
      .select({ count: count() })
      .from(schema.business)
      .where(
        and(
          gte(schema.business.createdAt, startLastMonth),
          lt(schema.business.createdAt, endLastMonth),
        ),
      ),
    db
      .select({ count: count() })
      .from(schema.product)
      .where(
        and(
          gte(schema.product.createdAt, startLastMonth),
          lt(schema.product.createdAt, endLastMonth),
        ),
      ),
    db
      .select({ total: sum(schema.payment.amount) })
      .from(schema.payment)
      .where(
        and(
          eq(schema.payment.status, "approved"),
          gte(schema.payment.createdAt, startLastMonth),
          lt(schema.payment.createdAt, endLastMonth),
        ),
      ),
  ]);

  const totalBusinesses = totalBusinessesResult[0]?.count ?? 0;
  const bannedBusinesses = bannedBusinessesResult[0]?.count ?? 0;
  const bannedProducts = bannedProductsResult[0]?.count ?? 0;
  const totalProducts = totalProductsResult[0]?.count ?? 0;
  const totalApprovedPayments = totalApprovedPaymentsResult[0]?.count ?? 0;
  const totalPendingPayments = totalPendingPaymentsResult[0]?.count ?? 0;
  const totalRejectedPayments = totalRejectedPaymentsResult[0]?.count ?? 0;
  const trialsActives = trialsActivesResult[0]?.count ?? 0;
  const businessesCurrentMonth = businessesCurrentMonthResult[0]?.count ?? 0;
  const productsCurrentMonth = productsCurrentMonthResult[0]?.count ?? 0;
  const businessesLastMonth = businessesLastMonthResult[0]?.count ?? 0;
  const productsLastMonth = productsLastMonthResult[0]?.count ?? 0;

  const currentRevenue = Number(paymentsCurrentMonthResult[0]?.total) || 0;
  const lastRevenue = Number(paymentsLastMonthResult[0]?.total) || 0;

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
  };

  return { stats };
}

// ====================== 📈 Analytics ======================

async function getAnalyticsData(): Promise<{
  planDistribution: Analytics["planDistribution"];
  monthlyData: Analytics["monthlyRevenue"];
  businessGrowthData: Analytics["businessGrowth"];
}> {
  // Count businesses by plan type
  const [freeResult, basicResult, premiumResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(schema.business)
      .innerJoin(
        schema.currentPlan,
        eq(schema.business.id, schema.currentPlan.businessId),
      )
      .where(eq(schema.currentPlan.planType, "FREE")),
    db
      .select({ count: count() })
      .from(schema.business)
      .innerJoin(
        schema.currentPlan,
        eq(schema.business.id, schema.currentPlan.businessId),
      )
      .where(eq(schema.currentPlan.planType, "BASIC")),
    db
      .select({ count: count() })
      .from(schema.business)
      .innerJoin(
        schema.currentPlan,
        eq(schema.business.id, schema.currentPlan.businessId),
      )
      .where(eq(schema.currentPlan.planType, "PREMIUM")),
  ]);

  const free = freeResult[0]?.count ?? 0;
  const basic = basicResult[0]?.count ?? 0;
  const premium = premiumResult[0]?.count ?? 0;

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

  // Get payments for the last 6 months
  const monthlyPayments = await db
    .select({
      createdAt: schema.payment.createdAt,
      amount: schema.payment.amount,
    })
    .from(schema.payment)
    .where(
      and(
        gte(schema.payment.createdAt, sixMonthsAgo),
        eq(schema.payment.status, "approved"),
      ),
    );

  // Get businesses created in the last 6 months
  const businessByMonth = await db
    .select({
      createdAt: schema.business.createdAt,
    })
    .from(schema.business)
    .where(gte(schema.business.createdAt, sixMonthsAgo));

  // 🔹 Revenue mensual
  const monthlyRevenue = Array.from({ length: 6 }).map((_, i) => {
    const date = startOfMonth(subMonths(new Date(), 5 - i));
    const month = format(date, "MMM");
    const nextMonth = addMonths(date, 1);

    const revenue = monthlyPayments
      .filter((p) => p.createdAt >= date && p.createdAt < nextMonth && p.amount)
      .reduce((acc, p) => acc + Number(p.amount || 0), 0);

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
    const nextMonth = addMonths(date, 1);

    const count = businessByMonth.filter(
      (b) => b.createdAt >= date && b.createdAt < nextMonth,
    ).length;

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
  cacheTag("admin-page");

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

      <RevenueChart data={monthlyData} />
    </div>
  );
}
