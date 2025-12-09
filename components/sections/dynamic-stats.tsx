import { startOfMonth, subMonths } from "date-fns";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { Package, Store } from "lucide-react";
import { connection } from "next/server";
import { db } from "@/db";
import { business, product } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function calcTrend(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export async function DynamicStats() {
  // ✅ CRITICAL: Call connection() BEFORE new Date() to mark as dynamic
  await connection();

  const now = new Date();
  const startThisMonth = startOfMonth(now);
  const startLastMonth = startOfMonth(subMonths(now, 1));
  const endLastMonth = startThisMonth;
  const [
    activeBusinessesTotal,
    activeBusinessesLastMonth,
    productsTotal,
    productsLastMonth,
  ] = await Promise.all([
    // Total de negocios activos
    db
      .select({ count: count() })
      .from(business)
      .where(and(eq(business.isActive, true), eq(business.isBanned, false))),
    // Negocios activos creados el mes pasado
    db
      .select({ count: count() })
      .from(business)
      .where(
        and(
          eq(business.isActive, true),
          eq(business.isBanned, false),
          gte(business.createdAt, startLastMonth),
          lt(business.createdAt, endLastMonth),
        ),
      ),
    // Total de productos activos
    db
      .select({ count: count() })
      .from(product)
      .where(and(eq(product.active, true), eq(product.isBanned, false))),
    // Productos activos creados el mes pasado
    db
      .select({ count: count() })
      .from(product)
      .where(
        and(
          eq(product.active, true),
          eq(product.isBanned, false),
          gte(product.createdAt, startLastMonth),
          lt(product.createdAt, endLastMonth),
        ),
      ),
  ]);

  const stats = {
    businesses: {
      value: activeBusinessesTotal[0].count,
      trend: calcTrend(
        activeBusinessesTotal[0].count,
        activeBusinessesLastMonth[0].count,
      ),
    },
    products: {
      value: productsTotal[0].count,
      trend: calcTrend(productsTotal[0].count, productsLastMonth[0].count),
    },
  };

  return (
    <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

export function StatsSkeletons() {
  return (
    <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="mb-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
