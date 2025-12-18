import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/lib/orpc";
import type { MercadoPagoCallbackParams } from "@/types";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<MercadoPagoCallbackParams>;
}) {
  const paymentIdMP = (await searchParams).payment_id;
  const paymentIdDB = (await searchParams).external_reference;

  if (!paymentIdMP || !paymentIdDB) {
    if (!paymentIdMP) {
    }
    if (!paymentIdDB) {
    }

    redirect("/dashboard/subscription");
  }

  await orpc.payment.success({ paymentIdMP, paymentIdDB });

  const { payment } = await orpc.payment.getPayment({ paymentIdDB });

  if (!payment) {
    redirect("/dashboard/subscription");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Pago Exitoso</CardTitle>
          <CardDescription>
            Tu suscripción ha sido activada correctamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 rounded-lg bg-muted p-4">
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <span className="font-semibold text-green-600">Aprobado</span>
            </div>
            {payment.mpPaymentId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID de Pago</span>
                <span className="font-mono text-sm">{payment.mpPaymentId}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Ir al Panel</Link>
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
