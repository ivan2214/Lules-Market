import { StatCardSkeleton } from "@/components/admin/skeletons/stat-card-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  <div className="space-y-6 bg-red-800">
    <div>
      <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Vista general de estadísticas y métricas del sistema
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Payment Stats */}
    <div className="grid gap-4 md:grid-cols-3">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Plan Distribution */}
    <div className="grid gap-4 md:grid-cols-3">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Charts */}
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
          <CardDescription>
            Evolución de ingresos en los últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Crecimiento de Negocios</CardTitle>
          <CardDescription>Nuevos negocios registrados por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Distribución de Planes</CardTitle>
        <CardDescription>Negocios por tipo de plan</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  </div>;
}
