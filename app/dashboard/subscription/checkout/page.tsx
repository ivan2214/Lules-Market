import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { SubscriptionPlan } from "@/app/generated/prisma";
import { CheckoutButton } from "@/components/dashboard/checkout-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SUBSCRIPTION_LIMITS } from "@/lib/subscription-limits";

async function CheckoutContent({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const plan = (await searchParams).plan as SubscriptionPlan;

  if (!plan || plan === "FREE") {
    redirect("/dashboard/subscription");
  }

  const planLimits = SUBSCRIPTION_LIMITS[plan];

  if (!planLimits) {
    redirect("/dashboard/subscription");
  }

  const features =
    plan === "BASIC"
      ? [
          `Hasta ${planLimits.maxProducts} productos`,
          "Estadísticas simples",
          "Prioridad media en búsquedas",
          "Soporte por email",
        ]
      : [
          "Productos ilimitados",
          "Destacar productos",
          "Estadísticas avanzadas",
          "Máxima prioridad en búsquedas",
          "Soporte prioritario",
        ];

  return (
    <>
      <Button asChild variant="ghost">
        <Link href="/dashboard/subscription">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Confirmar Suscripción</CardTitle>
          <CardDescription>
            Revisa los detalles de tu plan antes de continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-xl">Plan {plan}</h3>
                <p className="text-muted-foreground text-sm">
                  Suscripción mensual
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-3xl">
                  ${planLimits.price.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-sm">/mes</p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Incluye:</h4>
              <ul className="space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 rounded-lg bg-muted p-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${planLimits.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-lg">
                <span>Total</span>
                <span>${planLimits.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <CheckoutButton plan={plan} />

          <p className="text-center text-muted-foreground text-xs">
            Al continuar, aceptas nuestros términos y condiciones. El pago se
            procesará de forma segura a través de Mercado Pago.
          </p>
        </CardContent>
      </Card>
    </>
  );
}

function CheckoutSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-32" />
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    </>
  );
}

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
