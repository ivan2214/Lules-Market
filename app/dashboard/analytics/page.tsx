import { Suspense } from "react";
import { PeriodSelector } from "@/components/dashboard/period-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsData } from "./analytics-data";

type SearchParams = Promise<{ period?: "7d" | "30d" | "90d" }>;

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i.toString()} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <div className="mt-2">
              <Skeleton className="mb-2 h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border p-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="mt-4 h-[300px] w-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i.toString()} className="rounded-lg border p-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="mt-4 h-40 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const period = params.period || "30d";

  return (
    <div className="space-y-6">
      {/* ✅ TODO fuera del Suspense - se prerenderiza */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Estadísticas</h1>
          <p className="text-muted-foreground">
            Analiza el rendimiento de tu negocio
          </p>
        </div>
        {/* ✅ PeriodSelector también fuera - es Client Component puro */}
        <PeriodSelector currentPeriod={period} />
      </div>

      {/* ✅ Solo el contenido que necesita auth va en Suspense */}
      <Suspense key={period} fallback={<AnalyticsSkeleton />}>
        <AnalyticsData period={period} />
      </Suspense>
    </div>
  );
}
