import { Download } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { PaymentsClient } from "./components/payments-client";

export default async function PaymentsPage() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.ADMIN.PAYMENTS.GET_ALL);

  const payments = await db.query.payment.findMany({
    with: {
      business: true,
    },
  });
  const webhookEvents = await db.query.webhookEvent.findMany();

  const totalRevenue = payments
    .filter((p) => p.status === "approved")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
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
            <div className="font-bold text-2xl">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Aprobados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-green-600">
              {payments.filter((p) => p.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-yellow-600">
              {payments.filter((p) => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              ${(totalRevenue / 100).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentsClient payments={payments} webhookEvents={webhookEvents} />
    </div>
  );
}
