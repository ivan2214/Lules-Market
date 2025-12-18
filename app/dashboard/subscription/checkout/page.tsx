import { eq } from "drizzle-orm";
import { ArrowLeft, Check, InfinityIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CheckoutButton } from "@/app/dashboard/_components/checkout-button";
import { Button } from "@/app/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import { Skeleton } from "@/app/shared/components/ui/skeleton";
import { db, schema } from "@/db";
import type { PlanType } from "@/db/types";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

async function getPlanLimits(planType: PlanType) {
  const plan = await db.query.plan.findFirst({
    where: eq(schema.plan.type, planType),
  });

  if (!plan) {
    return null;
  }

  return plan;
}

async function CheckoutContent({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planType } = await searchParams;

  if (!planType || planType === "FREE") {
    redirect("/dashboard/subscription");
  }

  const plan = await getPlanLimits(planType as PlanType);

  if (!plan) {
    redirect("/dashboard/subscription");
  }

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
                <h3 className="font-bold text-xl">Plan {plan.name}</h3>
                <p className="text-muted-foreground text-sm">
                  Suscripción mensual
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-3xl">
                  {formatCurrency(plan.price, "ARS")}
                </p>
                <p className="text-muted-foreground text-sm">/mes</p>
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Incluye:</h4>
              <ul className="space-y-2">
                {(plan.maxProducts || plan.type === "PREMIUM") && (
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span
                      className={cn(
                        "text-sm",
                        plan.type === "PREMIUM" && "flex items-center gap-2",
                      )}
                    >
                      {plan.type === "PREMIUM"
                        ? "Productos Ilimitados"
                        : `${plan.maxProducts} Productos`}
                      {plan.type === "PREMIUM" && (
                        <InfinityIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      )}
                    </span>
                  </div>
                )}
                {(plan.maxImagesPerProduct || plan.type === "PREMIUM") && (
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span
                      className={cn(
                        "text-sm",
                        plan.type === "PREMIUM" && "flex items-center gap-2",
                      )}
                    >
                      {plan.type === "PREMIUM"
                        ? "Imágenes Ilimitadas"
                        : `${plan.maxImagesPerProduct} imágenes por producto`}
                      {plan.type === "PREMIUM" && (
                        <InfinityIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      )}
                    </span>
                  </div>
                )}
                {plan.features.map((feature) => (
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
                <span>{formatCurrency(plan.price, "ARS")}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(plan.price, "ARS")}</span>
              </div>
            </div>
          </div>

          <CheckoutButton plan={plan.type} />

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
