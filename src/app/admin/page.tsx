import {
  ArrowRight,
  Building2,
  CreditCard,
  DollarSign,
  Package,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import pathsConfig from "@/config/paths.config";
import {
  getAdminAnalyticsData,
  getAdminDashboardStats,
  getAdminRecentUsers,
  getAdminTotalUsersCount,
} from "@/data/admin/get";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AdminCharts } from "./_components/admin-charts";

export default async function AdminPage() {
  const [statsData, analyticsData, recentUsers, totalUsers] = await Promise.all(
    [
      getAdminDashboardStats(),
      getAdminAnalyticsData(),
      getAdminRecentUsers(5),
      getAdminTotalUsersCount(),
    ],
  );

  const { stats } = statsData;
  const { monthlyData, businessGrowthData } = analyticsData;

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Visión general del estado de la plataforma y métricas clave.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${stats.payments.totalRevenue.total.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats.payments.totalRevenue.trend.isPositive ? "+" : ""}
              {stats.payments.totalRevenue.trend.percentage}% respecto al mes
              anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Comercios Activos
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.businesses.active}</div>
            <p className="text-muted-foreground text-xs">
              {stats.businesses.trend.isPositive ? "+" : ""}
              {stats.businesses.trend.percentage}% respecto al mes anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Productos Totales
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stats.products.total}</div>
            <p className="text-muted-foreground text-xs">
              {stats.products.active} activos actualmente
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalUsers}</div>
            <p className="text-muted-foreground text-xs">
              {stats.trials.actives} pruebas gratuitas activas
            </p>
          </CardContent>
        </Card>
      </div>

      <AdminCharts
        revenueData={monthlyData.data}
        growthData={businessGrowthData.data}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
            <CardDescription>
              Últimos usuarios registrados en la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    <span className="font-medium text-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="font-medium text-sm leading-none">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {user.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <span className="rounded-full border px-2 py-0.5 text-muted-foreground text-xs capitalize">
                      {user.role?.toLowerCase() || "user"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <Button variant="ghost" className="w-full" asChild>
                <Link href={pathsConfig.admin.entities}>
                  Ver todos los usuarios <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Accesos Directos</CardTitle>
            <CardDescription>Gestión rápida de la plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin/entities">
              <div className="flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
                <Users className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Gestionar Entidades</p>
                  <p className="text-muted-foreground text-xs">
                    Usuarios y Comercios
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/admin/products">
              <div className="flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
                <Package className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Moderar Productos</p>
                  <p className="text-muted-foreground text-xs">
                    {stats.products.total} productos registrados
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/admin/plans">
              <div className="flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
                <CreditCard className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Planes y Pagos</p>
                  <p className="text-muted-foreground text-xs">
                    Gestionar suscripciones
                  </p>
                </div>
              </div>
            </Link>
            <Link href="/admin/logs">
              <div className="flex items-center gap-4 rounded-md border p-4 transition-colors hover:bg-muted/50">
                <Shield className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Auditoría</p>
                  <p className="text-muted-foreground text-xs">
                    Ver logs del sistema
                  </p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
