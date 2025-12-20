import { connection } from "next/server";
import { GridAnalytics } from "@/features/(admin)/admin/_components/grid-analytics";
import { GridPayments } from "@/features/(admin)/admin/_components/grid-payments";
import { GridPlansDistribution } from "@/features/(admin)/admin/_components/grid-plans-distribution";
import { GridStats } from "@/features/(admin)/admin/_components/grid-stats";
import { TrialStat } from "@/features/(admin)/admin/_components/stats-trial";
import { orpcTanstack } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function AdminDashboard() {
  await connection();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    orpcTanstack.admin.getAdminDashboardStats.queryOptions(),
  );
  await queryClient.prefetchQuery(
    orpcTanstack.admin.getAnalyticsData.queryOptions(),
  );

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
      <HydrateClient client={queryClient}>
        <GridStats />
      </HydrateClient>

      {/* Pagos */}
      <HydrateClient client={queryClient}>
        <GridPayments />
      </HydrateClient>

      {/* Gráficos */}
      <HydrateClient client={queryClient}>
        <GridAnalytics />
      </HydrateClient>

      {/* Trials */}
      <HydrateClient client={queryClient}>
        <TrialStat />
      </HydrateClient>

      {/* Distribución de planes */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Planes</CardTitle>
          <CardDescription>Negocios por tipo de plan</CardDescription>
        </CardHeader>
        <CardContent>
          <HydrateClient client={queryClient}>
            <GridPlansDistribution />
          </HydrateClient>
        </CardContent>
      </Card>
    </div>
  );
}
