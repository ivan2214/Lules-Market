import { XCircle } from "lucide-react";
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

export default async function PaymentFailurePage({
  searchParams,
}: {
  searchParams: Promise<MercadoPagoCallbackParams>;
}) {
  const paymentIdDB = (await searchParams).external_reference;

  if (!paymentIdDB) {
    redirect(pathsConfig.dashboard.subscription.root);
  }

  await api.payment.failure.post({ paymentIdDB });

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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Pago Rechazado</CardTitle>
          <CardDescription>No se pudo procesar tu pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-muted-foreground text-sm">
              Tu pago no pudo ser procesado. Esto puede deberse a fondos
              insuficientes, datos incorrectos o problemas con tu método de
              pago.
            </p>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard/subscription">Intentar Nuevamente</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard">Volver al Panel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
