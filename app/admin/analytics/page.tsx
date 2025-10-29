"use client";

import {
  DollarSign,
  Download,
  Package,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { BusinessGrowthChart } from "@/components/admin/business-growth-chart";
import { PlanDistributionChart } from "@/components/admin/plan-distribution-chart";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockAnalytics } from "@/lib/data/mock-data";

export default function AnalyticsPage() {
  const analytics = mockAnalytics;

  const handleExport = (format: "csv" | "pdf") => {
    console.log("Exportar analytics en formato:", format);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Análisis y Métricas
          </h1>
          <p className="text-muted-foreground">
            Vista completa de estadísticas y tendencias
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{analytics.totalUsers}</div>
            <p className="text-muted-foreground text-xs">
              {analytics.bannedUsers} baneados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Negocios
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {analytics.totalBusinesses}
            </div>
            <p className="text-muted-foreground text-xs">
              {analytics.bannedBusinesses} baneados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Productos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{analytics.totalProducts}</div>
            <p className="text-muted-foreground text-xs">
              {analytics.bannedProducts} baneados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${(analytics.totalRevenue / 1000).toFixed(0)}k
            </div>
            <p className="text-muted-foreground text-xs">
              {analytics.totalPayments} pagos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trials and Coupons */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Trials Activos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{analytics.activeTrials}</div>
            <p className="text-muted-foreground text-xs">
              Pruebas gratuitas en curso
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Cupones Activos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{analytics.activeCoupons}</div>
            <p className="text-muted-foreground text-xs">Cupones disponibles</p>
          </CardContent>
        </Card>
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
                {analytics.planDistribution.FREE}
              </p>
              <p className="text-muted-foreground text-xs">
                {(
                  (analytics.planDistribution.FREE /
                    analytics.totalBusinesses) *
                  100
                ).toFixed(1)}
                % del total
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Plan BASIC
              </p>
              <p className="font-bold text-3xl">
                {analytics.planDistribution.BASIC}
              </p>
              <p className="text-muted-foreground text-xs">
                {(
                  (analytics.planDistribution.BASIC /
                    analytics.totalBusinesses) *
                  100
                ).toFixed(1)}
                % del total
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Plan PREMIUM
              </p>
              <p className="font-bold text-3xl">
                {analytics.planDistribution.PREMIUM}
              </p>
              <p className="text-muted-foreground text-xs">
                {(
                  (analytics.planDistribution.PREMIUM /
                    analytics.totalBusinesses) *
                  100
                ).toFixed(1)}
                % del total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={analytics.monthlyRevenue} />
        <BusinessGrowthChart data={analytics.businessGrowth} />
      </div>

      <PlanDistributionChart data={analytics.planDistribution} />

      {/* Conversion Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Conversión</CardTitle>
          <CardDescription>Tasas de conversión y crecimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Tasa de Conversión Trial → Pago
              </p>
              <p className="font-bold text-3xl">68%</p>
              <p className="text-green-600 text-xs">+12% vs mes anterior</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Crecimiento Mensual
              </p>
              <p className="font-bold text-3xl">+23%</p>
              <p className="text-green-600 text-xs">Nuevos negocios</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Retención
              </p>
              <p className="font-bold text-3xl">89%</p>
              <p className="text-green-600 text-xs">Negocios activos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
