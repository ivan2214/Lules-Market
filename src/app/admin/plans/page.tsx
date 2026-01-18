import { CreditCard, Gift, Package, ScrollText, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getAdminAllPlans } from "@/data/admin/plans-admin";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { PlansTableActions } from "./_components/plans-table-actions";

export default function AdminPlansPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Gestión de Planes
          </h1>
          <p className="mt-2 text-muted-foreground">
            Administra los planes de suscripción de la plataforma.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <QuickLink
          href="/admin/grants"
          icon={Gift}
          title="Otorgar Planes"
          description="Asignar trials y planes a comercios"
        />
        <QuickLink
          href="/admin/payments"
          icon={CreditCard}
          title="Ver Pagos"
          description="Historial de pagos de comercios"
        />
        <QuickLink
          href="/admin/logs"
          icon={ScrollText}
          title="Logs del Sistema"
          description="Auditoría de acciones"
        />
        <QuickLink
          href="/admin/entities"
          icon={Users}
          title="Usuarios y Comercios"
          description="Gestión de entidades"
        />
        <QuickLink
          href="/admin/products"
          icon={Package}
          title="Productos"
          description="Moderación de productos"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planes Disponibles</CardTitle>
          <CardDescription>
            Lista de todos los planes de la plataforma. Solo existen 3 tipos:
            Gratis, Básico y Premium.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<PlansTableSkeleton />}>
            <PlansTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: Route;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Icon className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

async function PlansTable() {
  const plans = await getAdminAllPlans();

  if (!plans || plans.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No hay planes configurados.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Max Productos</TableHead>
          <TableHead>Max Imágenes por Producto</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plans.map((plan) => (
          <TableRow key={plan.type}>
            <TableCell>
              <Badge
                variant={
                  plan.type === "PREMIUM"
                    ? "default"
                    : plan.type === "BASIC"
                      ? "secondary"
                      : "outline"
                }
              >
                {plan.type}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">{plan.name}</TableCell>
            <TableCell>
              {plan.price === 0 ? "Gratis" : `$${plan.price.toLocaleString()}`}
            </TableCell>
            <TableCell>{plan.maxProducts}</TableCell>
            <TableCell>{plan.maxImagesPerProduct}</TableCell>
            <TableCell>
              <Badge variant={plan.isActive ? "default" : "destructive"}>
                {plan.isActive ? "Activo" : "Pausado"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <PlansTableActions plan={plan} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PlansTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
