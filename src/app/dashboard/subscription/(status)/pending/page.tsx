import { Clock } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { api } from "@/lib/eden";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { MercadoPagoCallbackParams } from "@/shared/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PaymentPendingPage({
  searchParams,
}: {
  searchParams: Promise<MercadoPagoCallbackParams>;
}) {
  const paymentIdDB = (await searchParams).external_reference;

  if (!paymentIdDB) {
    redirect(pathsConfig.dashboard.subscription.root);
  }

  const { data: paymentData } = await api.payment.getPayment.get({
    query: { paymentIdDB },
  });
  const payment = paymentData?.payment;

  if (!payment) {
    redirect(pathsConfig.dashboard.subscription.root);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-10 w-10 text-amber-600" />
          </div>
          <CardTitle className="text-2xl">Pago Pendiente</CardTitle>
          <CardDescription>Tu pago está siendo procesado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-muted-foreground text-sm">
              Tu pago está siendo procesado. Recibirás una notificación cuando
              se complete. Esto puede tomar algunos minutos.
            </p>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-semibold">{payment.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto</span>
              <span className="font-semibold">
                ${payment.amount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Volver al Panel</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/subscription">Ver Suscripción</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
