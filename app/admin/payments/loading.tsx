import { Download } from "lucide-react";
import { Button } from "@/app/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import { Skeleton } from "@/app/shared/components/ui/skeleton";
import { Spinner } from "@/app/shared/components/ui/spinner";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Pagos y Facturación
          </h1>
          <p className="text-muted-foreground">
            Gestiona todos los pagos y eventos de webhook
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Aprobados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <section className="flex flex-col items-start gap-y-5">
            <div>
              <Skeleton className="h-5 w-44" />
            </div>
            <section className="mx-auto">
              <Spinner className="size-5" />
            </section>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos de Webhook</CardTitle>
          <CardDescription>
            Auditoría de eventos de Mercado Pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section className="flex flex-col items-start gap-y-5">
            <div>
              <Skeleton className="h-5 w-44" />
            </div>
            <section className="mx-auto">
              <Spinner className="size-5" />
            </section>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
