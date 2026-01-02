"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Package, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { orpc } from "@/orpc";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { calcTrend } from "@/shared/utils/calc-trend";

export function DynamicStats() {
  const {
    data: {
      activeBusinessesTotal,
      activeBusinessesLastMonth,
      productsTotal,
      productsLastMonth,
    },
  } = useSuspenseQuery(orpc.analytics.getHomePageStats.queryOptions());

  const stats = {
    businesses: {
      value: activeBusinessesTotal,
      trend: calcTrend(activeBusinessesTotal, activeBusinessesLastMonth),
    },
    products: {
      value: productsTotal,
      trend: calcTrend(productsTotal, productsLastMonth),
    },
  };

  return (
    <section className="mb-12 grid gap-4 sm:grid-cols-2">
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
