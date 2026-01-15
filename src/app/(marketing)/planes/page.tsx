import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPlans } from "@/data/plans/get";
import { env } from "@/env/server";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ComparisonTable } from "./_components/comparison-table";
import { PlanCards } from "./_components/plan-cards";

export const metadata: Metadata = {
  title: "Planes y Precios - Lules Market",
  description:
    "Conoce nuestros planes y elige el que mejor se adapte a tu negocio. Desde opciones gratuitas hasta planes premium con todas las funcionalidades.",
  keywords: "planes, precios, suscripción, marketplace, comercios locales",
  openGraph: {
    title: "Planes y Precios - Lules Market",
    description:
      "Conoce nuestros planes y elige el que mejor se adapte a tu negocio.",
    url: `${env.APP_URL}/planes`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planes y Precios - Lules Market",
    description:
      "Conoce nuestros planes y elige el que mejor se adapte a tu negocio.",
  },
  alternates: {
    canonical: `${env.APP_URL}/planes`,
  },
};

export default async function PlanesPage() {
  const plans = await getPlans();

  return (
    <section className="flex w-full flex-col items-center justify-center gap-y-16">
      <div className="text-center">
        <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
          Planes para cada tipo de negocio
        </h1>
        <p className="mt-6 text-pretty text-lg text-muted-foreground">
          Comienza gratis y crece con planes accesibles diseñados para comercios
          locales
        </p>
      </div>

      <PlanCards plans={plans} />

      {/* Comparison Table */}

      <ComparisonTable plans={plans} />

      {/* FAQ */}
      <div>
        <h2 className="mb-8 text-center font-bold text-3xl">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                ¿Puedo cambiar de plan en cualquier momento?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sí, puedes mejorar tu plan en cualquier momento. El cambio es
                inmediato y solo pagas la diferencia prorrateada.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                ¿Qué métodos de pago aceptan?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aceptamos todos los métodos de pago disponibles en Mercado Pago:
                tarjetas de crédito, débito, transferencias y efectivo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                ¿Hay permanencia mínima?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No, no hay permanencia mínima. Puedes cancelar tu suscripción en
                cualquier momento sin penalizaciones.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                ¿Qué pasa si cancelo mi suscripción?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Si cancelas, tu plan seguirá activo hasta el final del período
                pagado. Después, volverás al plan gratuito automáticamente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Card className="mx-auto max-w-3xl bg-primary text-primary-foreground">
          <CardContent className="py-12">
            <h2 className="mb-4 text-balance font-bold text-3xl">
              ¿Listo para comenzar?
            </h2>
            <p className="mb-8 text-pretty text-lg text-primary-foreground/90">
              Únete a cientos de comercios que ya están creciendo con nuestra
              plataforma
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/sign-up">
                Registrar mi Negocio Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
