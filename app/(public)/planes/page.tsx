import { ArrowRight, Check, Crown, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import { orpc } from "@/lib/orpc";

export const metadata: Metadata = {
  title: "Planes y Precios - Lules Market",
  description:
    "Conoce nuestros planes y elige el que mejor se adapte a tu negocio. Desde opciones gratuitas hasta planes premium con todas las funcionalidades.",
  keywords: "planes, precios, suscripción, marketplace, comercios locales",
  openGraph: {
    title: "Planes y Precios - Lules Market",
    description:
      "Conoce nuestros planes y elige el que mejor se adapte a tu negocio.",
    url: "https://lules-market.vercel.app/planes",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planes y Precios - Lules Market",
    description:
      "Conoce nuestros planes y elige el que mejor se adapte a tu negocio.",
  },
  alternates: {
    canonical: "https://lules-market.vercel.app/planes",
  },
};

export default async function PlanesPage() {
  const plans = await orpc.plan.getAllPlans();

  return (
    <div className="container mx-auto py-16">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-5xl">
          Planes para cada tipo de negocio
        </h1>
        <p className="mt-6 text-pretty text-lg text-muted-foreground">
          Comienza gratis y crece con planes accesibles diseñados para comercios
          locales
        </p>
      </div>

      <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon =
            plan.type === "FREE"
              ? Sparkles
              : plan.type === "BASIC"
                ? Zap
                : Crown;
          return (
            <Card
              key={plan.name}
              className={
                plan.popular ? "relative border-primary shadow-lg" : ""
              }
            >
              {plan.popular && (
                <Badge className="-top-3 -translate-x-1/2 absolute left-1/2">
                  Más Popular
                </Badge>
              )}
              <CardHeader>
                <Icon className="mb-4 h-10 w-10 text-primary" />
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="font-bold text-4xl">
                    ${plan.price.toLocaleString()}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/mes</span>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href="/auth/signup">
                    Comenzar Ahora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center font-bold text-3xl">
          Comparación Detallada
        </h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-semibold">
                      Característica
                    </th>
                    <th className="p-4 text-center font-semibold">Gratuito</th>
                    <th className="bg-primary/5 p-4 text-center font-semibold">
                      Básico
                    </th>
                    <th className="p-4 text-center font-semibold">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">Cantidad de Productos</td>
                    <td className="p-4 text-center">10</td>
                    <td className="bg-primary/5 p-4 text-center">50</td>
                    <td className="p-4 text-center font-bold">Ilimitados</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Imágenes por producto</td>
                    <td className="p-4 text-center">1</td>
                    <td className="bg-primary/5 p-4 text-center">3</td>
                    <td className="p-4 text-center">5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Prioridad en listados</td>
                    <td className="p-4 text-center">Estándar</td>
                    <td className="bg-primary/5 p-4 text-center">Media</td>
                    <td className="p-4 text-center font-bold">Alta</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Estadísticas de visitas</td>
                    <td className="p-4 text-center">-</td>
                    <td className="bg-primary/5 p-4 text-center">Básicas</td>
                    <td className="p-4 text-center">Avanzadas</td>
                  </tr>
                  <tr>
                    <td className="p-4">Soporte técnico</td>
                    <td className="p-4 text-center">Email</td>
                    <td className="bg-primary/5 p-4 text-center">
                      Email Rápido
                    </td>
                    <td className="p-4 text-center font-medium text-primary">
                      WhatsApp Directo
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-16 max-w-3xl">
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
      <div className="mt-16 text-center">
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
              <Link href="/auth/signup">
                Registrar mi Negocio Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
