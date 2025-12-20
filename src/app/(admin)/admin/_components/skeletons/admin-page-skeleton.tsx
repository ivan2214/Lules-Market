import {
  AlertCircle,
  CheckCircle,
  CreditCard,
  DiscIcon,
  Package,
  Store,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { StatCardSkeleton } from "./stat-card-skeleton";

export function AdminPageSkeleton() {
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

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCardSkeleton
          title="Total Negocios"
          icon={Store}
          showTrendSkeleton
        />
        <StatCardSkeleton
          title="Total Productos"
          icon={Package}
          showTrendSkeleton
        />
        <StatCardSkeleton
          title="Ingresos Totales"
          icon={CreditCard}
          showTrendSkeleton
        />
      </div>

      {/* Payment Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCardSkeleton title="Pagos Aprobados" icon={CheckCircle} />
        <StatCardSkeleton title="Pagos Pendientes" icon={AlertCircle} />
        <StatCardSkeleton title="Pagos Rechazados" icon={XCircle} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crecimiento de Negocios</CardTitle>
            <CardDescription>
              Nuevos negocios registrados por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Planes</CardTitle>
            <CardDescription>Negocios por tipo de plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
      {/* trials y cupones */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCardSkeleton title="Trials Activos" icon={TrendingUp} />
        <StatCardSkeleton title="Cupones Activos" icon={DiscIcon} />
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Planes</CardTitle>
          <CardDescription>Negocios por tipo de plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {(["FREE", "BASIC", "PREMIUM"] as const).map((plan) => (
              <div key={plan} className="space-y-2">
                <p className="font-medium text-muted-foreground text-sm">
                  Plan {plan}
                </p>
                <Skeleton className="h-8 w-16" /> {/* Value */}
                <Skeleton className="h-3 w-24" /> {/* Percentage */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
          <CardDescription>
            Evolución de ingresos en los últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] max-h-80 w-full" />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="text-muted-foreground leading-none">
            Mostrando los ingresos totales de los últimos 6 meses
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
