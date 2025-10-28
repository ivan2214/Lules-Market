import { PeriodSelector } from "@/components/dashboard/period-selector";
import { AnalyticsData } from "./analytics-data";

type SearchParams = Promise<{ period?: "7d" | "30d" | "90d" }>;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const period = params.period || "30d";

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

      <AnalyticsData period={period} />
    </div>
  );
}
