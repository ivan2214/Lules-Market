/* Pagina para comercios donde le indica que tiene que iniciar sesion o registrarse */

import { ArrowRight, Store, TrendingUp, Zap } from "lucide-react";
import type { Metadata } from "next";

import Link from "next/link";
import { env } from "@/env/server";
import { api } from "@/lib/eden";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PlanPricingPreview } from "./_components/plan-pricing.preview";

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
    url: `${env.APP_URL}/para-comercios`,
    siteName: "Lules Market",
    images: [
      {
        url: `${env.APP_URL}/logo.webp`,
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
    images: [`${env.APP_URL}/logo.webp`],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${env.APP_URL}/para-comercios`,
  },
};

export default async function ForBusinessPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await api.plan.public["list-all"].get();
      return response;
    },
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-linear-to-b from-background to-muted px-4">
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
                <Link href="/auth/sign-up">
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
                <Link href="/auth/sign-in">
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
                <h3 className="mb-2 font-semibold">Imagen Profesional</h3>
                <p className="text-muted-foreground text-sm">
                  Diferénciate de la competencia con un perfil web propio. Da
                  confianza mostrando una imagen seria y organizada.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Mejor que Facebook</h3>
                <p className="text-muted-foreground text-sm">
                  Tus productos no se pierden en el feed. En Lules Market, tu
                  catálogo está siempre disponible y ordenado para quien lo
                  busca.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">Gestión Centralizada</h3>
                <p className="text-muted-foreground text-sm">
                  Actualiza precios, fotos y horarios en un solo lugar. Comparte
                  tu link y olvídate de responder siempre lo mismo.
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

          <HydrateClient client={queryClient}>
            <PlanPricingPreview />
          </HydrateClient>
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
                <Link href="/auth/sign-up">
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
