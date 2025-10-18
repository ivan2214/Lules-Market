import { Eye, Package, Store, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnalyticsChart } from "@/components/dashboard/analytics-chart";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAnalytics } from "@/lib/actions/analytics-actions";
import { getBusiness } from "@/lib/actions/business-actions";
import { getSubscriptionLimits } from "@/lib/subscription-limits";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: "7d" | "30d" | "90d" }>;
}) {
  const business = await getBusiness();

  if (!business) {
    redirect("/dashboard/setup");
  }

  const limits = getSubscriptionLimits(business.plan);

  if (!limits.hasStatistics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground">
            Analiza el rendimiento de tu negocio
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">
              Estadísticas no disponibles
            </h3>
            <p className="mb-4 text-center text-muted-foreground text-sm">
              Mejora tu plan para acceder a estadísticas detalladas de tu
              negocio
            </p>
            <Button asChild>
              <Link href="/dashboard/subscription">Ver Planes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const period = (await searchParams).period || "30d";
  const analytics = await getAnalytics(period);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground">
            Analiza el rendimiento de tu negocio
          </p>
        </div>
        <PeriodSelector currentPeriod={period} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Visitas Totales
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{analytics.totalViews}</div>
            <p className="text-muted-foreground text-xs">
              Últimos {period === "7d" ? "7" : period === "30d" ? "30" : "90"}{" "}
              días
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Vistas de Productos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{analytics.productViews}</div>
            <p className="text-muted-foreground text-xs">
              {(
                (analytics.productViews / analytics.totalViews) * 100 || 0
              ).toFixed(1)}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Vistas del Negocio
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{analytics.businessViews}</div>
            <p className="text-muted-foreground text-xs">
              {(
                (analytics.businessViews / analytics.totalViews) * 100 || 0
              ).toFixed(1)}
              % del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Promedio Diario
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {(analytics.totalViews / analytics.dailyViews.length).toFixed(1)}
            </div>
            <p className="text-muted-foreground text-xs">Visitas por día</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Visitas en el Tiempo</CardTitle>
          <CardDescription>
            Evolución de las visitas a tu negocio y productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={analytics.dailyViews} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vistos</CardTitle>
            <CardDescription>
              Los productos que más interesan a tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topProducts.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No hay datos disponibles
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="line-clamp-1 font-medium">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {product.count} vistas
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Fuentes de Tráfico</CardTitle>
            <CardDescription>De dónde vienen tus visitantes</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topReferrers.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                No hay datos disponibles
              </p>
            ) : (
              <div className="space-y-4">
                {analytics.topReferrers.map((referrer) => (
                  <div
                    key={referrer.count}
                    className="flex items-center justify-between"
                  >
                    <span className="line-clamp-1 font-medium">
                      {referrer.referrer}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(referrer.count / analytics.totalViews) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-12 text-right text-muted-foreground text-sm">
                        {referrer.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
