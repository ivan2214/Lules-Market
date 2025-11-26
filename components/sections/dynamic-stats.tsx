import { startOfMonth, subMonths } from "date-fns";
import { MessageSquare, Package, Star, Store } from "lucide-react";
import { connection } from "next/server";
import prisma from "@/lib/prisma";
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
    reviewsTotal,
    reviewsLastMonth,
    avgRatingObj,
    avgRatingLastMonthObj,
  ] = await prisma.$transaction([
    prisma.business.count({ where: { isActive: true, isBanned: false } }),
    prisma.business.count({
      where: {
        isActive: true,
        isBanned: false,
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),
    prisma.product.count({ where: { active: true, isBanned: false } }),
    prisma.product.count({
      where: {
        active: true,
        isBanned: false,
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),
    prisma.review.count({ where: { isHidden: false } }),
    prisma.review.count({
      where: {
        isHidden: false,
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),
    prisma.review.aggregate({
      _avg: { rating: true },
      where: { isHidden: false },
    }),
    prisma.review.aggregate({
      _avg: { rating: true },
      where: {
        isHidden: false,
        createdAt: { gte: startLastMonth, lt: endLastMonth },
      },
    }),
  ]);

  const stats = {
    businesses: {
      value: activeBusinessesTotal,
      trend: calcTrend(activeBusinessesTotal, activeBusinessesLastMonth),
    },
    products: {
      value: productsTotal,
      trend: calcTrend(productsTotal, productsLastMonth),
    },
    reviews: {
      value: reviewsTotal,
      trend: calcTrend(reviewsTotal, reviewsLastMonth),
    },
    avgRating: {
      value: avgRatingObj._avg.rating ?? 0,
      trend:
        (((avgRatingObj._avg.rating ?? 0) -
          (avgRatingLastMonthObj._avg.rating ?? 0)) *
          100) /
        5,
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-sm">
            Opiniones Compartidas
          </CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.reviews.value}</div>
          <p
            className={cn(
              "text-muted-foreground text-xs",
              stats.reviews.trend > 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {stats.reviews.trend > 0 ? "+" : ""}
            {stats.reviews.trend.toFixed(1)}% este mes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-sm">
            Valoración Promedio
          </CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {stats.avgRating.value.toFixed(1)}
          </div>
          <p className={cn("text-muted-foreground text-xs")}>
            De <span className="font-bold text-yellow-600">5 estrellas</span>
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
