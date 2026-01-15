import { Package, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalyticsModel } from "@/server/modules/analytics/model";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { calcTrend } from "@/shared/utils/calc-trend";

export function DynamicStats({
  data,
}: {
  data: AnalyticsModel.HomePageStatsOutput;
}) {
  const {
    activeBusinessesTotal,
    activeBusinessesLastMonth,
    productsTotal,
    productsLastMonth,
  } = data?.stats || {};

  const stats = {
    businesses: {
      value: activeBusinessesTotal || 0,
      trend: calcTrend(
        activeBusinessesTotal || 0,
        activeBusinessesLastMonth || 0,
      ),
    },
    products: {
      value: productsTotal || 0,
      trend: calcTrend(productsTotal || 0, productsLastMonth || 0),
    },
  };

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-sm">
            Comercios Activos
          </CardTitle>
          <Store className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.businesses.value}</div>
          <p
            className={cn(
              "text-muted-foreground text-xs",
              stats.businesses.trend > 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {stats.businesses.trend > 0 ? "+" : ""}
            {stats.businesses.trend.toFixed(1)}% este mes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-sm">
            Productos Publicados
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.products.value}</div>
          <p
            className={cn(
              "text-muted-foreground text-xs",
              stats.products.trend > 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {stats.products.trend > 0 ? "+" : ""}
            {stats.products.trend.toFixed(1)}% este mes
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
