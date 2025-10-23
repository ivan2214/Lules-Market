/* Pagina para comercios donde le indica que tiene que iniciar sesion o registrarse */

import { ArrowRight, Check, Store, TrendingUp, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PLAN_FEATURES, PLAN_NAMES, PLAN_PRICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

export const metadata: Metadata = {
  title: "Para Comercios - Lules Market | Tu Vitrina Digital",
  description:
    "¿Tienes un comercio local? Lleva tu negocio al mundo digital. Publica tus productos, aumenta tu visibilidad y atrae más clientes. Comenzar es gratis.",
  keywords:
    "comercios locales, vitrina digital, negocios, emprendedores, vender online, marketplace local, Argentina",
  openGraph: {
    title: "Para Comercios - Lules Market | Tu Vitrina Digital",
    description:
      "Lleva tu comercio local al mundo digital. Aumenta tu visibilidad y atrae más clientes.",
    url: "https://lules-market.vercel.app/para-comercios",
    siteName: "Lules Market",
    images: [
      {
        url: "https://lules-market.vercel.app/logo.webp",
        width: 1200,
        height: 630,
        alt: "Lules Market - Para Comercios",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Para Comercios - Lules Market | Tu Vitrina Digital",
    description:
      "Lleva tu comercio local al mundo digital. Aumenta tu visibilidad y atrae más clientes.",
    images: ["https://lules-market.vercel.app/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lules-market.vercel.app/para-comercios",
  },
};

// Definición de los planes de precios
const pricingPlans = [
  {
    id: "free",
    name: PLAN_NAMES.FREE,
    price: PLAN_PRICES.FREE,
    period: "Para comenzar",
    features: PLAN_FEATURES.FREE,
    buttonText: "Comenzar Gratis",
    featured: false,
  },
  {
    id: "basic",
    name: PLAN_NAMES.BASIC,
    price: PLAN_PRICES.BASIC,
    period: "Por mes",
    features: PLAN_FEATURES.BASIC,
    buttonText: "Comenzar Ahora",
    featured: true,
  },
  {
    id: "premium",
    name: PLAN_NAMES.PREMIUM,
    price: PLAN_PRICES.PREMIUM,
    period: "Por mes",
    features: PLAN_FEATURES.PREMIUM,
    buttonText: "Comenzar Ahora",
    featured: false,
  },
];

export default function ForBusinessPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance font-bold text-4xl tracking-tight sm:text-6xl">
              Tu Vitrina Digital para Comercios Luleños
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground leading-relaxed">
              Publica tus productos o servicios, aumenta tu visibilidad y llega
              a potenciales clientes
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="/auth/signin">
                  Iniciar sesión
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/40 py-20">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-balance font-bold text-3xl tracking-tight sm:text-4xl">
              Todo lo que necesitas para crecer
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Herramientas simples y poderosas para impulsar tu negocio local
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Catálogo Digital</h3>
                <p className="text-muted-foreground text-sm">
                  Publica tus productos con fotos, descripciones y precios de
                  forma sencilla
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Mayor Visibilidad</h3>
                <p className="text-muted-foreground text-sm">
                  Aparece en búsquedas locales y atrae más clientes a tu negocio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Fácil de Usar</h3>
                <p className="text-muted-foreground text-sm">
                  Interfaz intuitiva que no requiere conocimientos técnicos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-muted/40 py-20">
        <div className="container">
          <div className="relative mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-balance font-bold text-3xl tracking-tight sm:text-4xl">
              Planes para cada negocio
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Comienza gratis y crece con planes accesibles
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative",
                  plan.featured && "border-primary shadow-lg",
                )}
              >
                <CardContent className="flex h-full flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="font-bold text-2xl">{plan.name}</h3>
                    <p className="mt-2 font-bold text-3xl">
                      ARS{formatCurrency(plan.price, "ARS")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {plan.period}
                    </p>
                  </div>
                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full"
                    variant={plan.featured ? "default" : "outline"}
                  >
                    <Link href="/auth/signup">{plan.buttonText}</Link>
                  </Button>
                  {plan.featured && (
                    <Badge className="-top-3 -right-3 absolute">
                      Más Popular
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-12 text-center">
              <h2 className="mb-4 text-balance font-bold text-3xl tracking-tight sm:text-4xl">
                ¿Listo para hacer crecer tu negocio?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-primary-foreground/90">
                Únete a cientos de comercios locales que ya están aumentando su
                visibilidad y ventas
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth/signup">
                  Registrar mi Negocio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
