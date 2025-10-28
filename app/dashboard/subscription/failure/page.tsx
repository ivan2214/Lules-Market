import { XCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  getPayment,
  processPaymentFailure,
} from "@/app/actions/payment-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MercadoPagoCallbackParams } from "@/types";

async function PaymentFailureContent({
  searchParams,
}: {
  searchParams: Promise<MercadoPagoCallbackParams>;
}) {
  const paymentIdDB = (await searchParams).external_reference;

  if (!paymentIdDB) {
    redirect("/dashboard/subscription");
  }

  await processPaymentFailure({ paymentIdDB });

  const payment = await getPayment({ paymentIdDB });

  if (!payment) {
    redirect("/dashboard/subscription");
  }

  return (
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
            insuficientes, datos incorrectos o problemas con tu método de pago.
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
  );
}

function PaymentFailureSkeleton() {
  return (
    <Card>
      <CardHeader className="text-center">
        <Skeleton className="mx-auto h-16 w-16 rounded-full" />
        <Skeleton className="mx-auto mt-4 h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

export default function PaymentFailurePage({
  searchParams,
}: {
  searchParams: Promise<MercadoPagoCallbackParams>;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <Suspense fallback={<PaymentFailureSkeleton />}>
        <PaymentFailureContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
