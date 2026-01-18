import {
  ArrowRight,
  Heart,
  Package,
  Search,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { DynamicStats } from "@/app/(home)/_components/sections/dynamic-stats";
import { FeaturedBusinesses } from "@/app/(home)/_components/sections/featured-businesses";
import { RecentProducts } from "@/app/(home)/_components/sections/recent-products";
import { getHomePageStats } from "@/data/analytics/get";
import { getFeaturedBusinesses } from "@/data/business/get";
import { getRecentProducts } from "@/data/products/get";

import { env } from "@/env/server";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export const metadata: Metadata = {
  title: "Lules Market - Productos y Comercios Locales en Lules, Tucumán",
  description:
    "Descubrí productos y comercios locales en Lules, Tucumán. Conectá con negocios de tu zona, encontrá ofertas exclusivas y apoyá a tu comunidad.",
  keywords: [
    "Lules Market",
    "Lules Tucumán",
    "productos Lules",
    "comercios Lules",
    "comprar en Lules",
    "negocios locales Lules",
    "tiendas Lules",
    "marketplace Lules",
    "emprendimientos Lules",
    "ofertas Lules",
    "vitrina digital",
    "comercio local Argentina",
  ],
  openGraph: {
    title: "Lules Market - Productos y Comercios Locales",
    description:
      "Descubrí productos y comercios locales en Lules, Tucumán. Tu vitrina digital para comprar y vender en tu comunidad.",
    url: env.APP_URL,
    siteName: "Lules Market",
    images: [
      {
        url: `${env.APP_URL}/logo.webp`,
        width: 512,
        height: 512,
        alt: "Lules Market - Tu vitrina digital en Lules, Tucumán",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lules Market - Productos y Comercios en Lules",
    description: "Descubrí productos y comercios locales en Lules, Tucumán.",
    images: [`${env.APP_URL}/logo.webp`],
    creator: "@lulesmarket",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const [stats, featuredBusinesses, recentProducts] = await Promise.all([
    getHomePageStats(),
    getFeaturedBusinesses(),
    getRecentProducts(),
  ]);

  return (
    <main className="container mx-auto space-y-20 px-4 py-8 lg:p-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl px-6 py-20 text-center shadow-2xl md:px-12 md:py-32">
        {/* Side glows */}
        <div className="absolute top-1/2 left-0 h-[420px] w-[420px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute top-1/2 right-0 h-[420px] w-[420px] translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="relative mx-auto max-w-4xl space-y-8">
          <h1 className="text-balance font-extrabold text-4xl tracking-tight drop-shadow-sm md:text-6xl lg:text-7xl">
            Conecta con tu comunidad local
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground md:text-2xl">
            La plataforma donde los comercios de Lules brillan. Descubre
            productos únicos, apoya a tus vecinos y encuentra todo lo que
            necesitas cerca de casa.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              className="group gap-2 font-semibold shadow-lg transition-all hover:scale-105"
              asChild
            >
              <Link href="/explorar/comercios">
                <Store className="h-5 w-5" />
                Explorar Comercios
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/explorar/productos">
                <Package className="h-5 w-5" />
                Ver Productos
                <ArrowRight className="ml-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats - Dynamic */}

      <DynamicStats data={stats} />
      <FeaturedBusinesses data={featuredBusinesses} />

      {/* For Customers Section */}
      <section className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div>
            <span className="mb-2 inline-block bg-accent/10 px-4 py-1.5 font-medium text-accent-foreground text-sm">
              Para Clientes
            </span>
            <h2 className="mb-4 text-balance font-bold text-3xl tracking-tight md:text-5xl">
              ¿Por qué elegir Lules Market?
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Facilitamos la conexión con los comercios de tu ciudad para que
              tengas la mejor experiencia de compra.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-none bg-muted/50 shadow-none transition-colors hover:bg-muted">
              <CardHeader>
                <Store className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Todo en un lugar</CardTitle>
                <CardDescription className="text-base">
                  Encuentra desde alimentos hasta servicios profesionales sin
                  salir de la plataforma.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none bg-muted/50 shadow-none transition-colors hover:bg-muted">
              <CardHeader>
                <Heart className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Apoyo Local</CardTitle>
                <CardDescription className="text-base">
                  Cada compra ayuda a crecer a un emprendedor o comercio de tu
                  comunidad.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none bg-muted/50 shadow-none transition-colors hover:bg-muted">
              <CardHeader>
                <Zap className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Contacto Directo</CardTitle>
                <CardDescription className="text-base">
                  Comunícate por WhatsApp directamente con los dueños para una
                  atención rápida.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none bg-muted/50 shadow-none transition-colors hover:bg-muted">
              <CardHeader>
                <Search className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Búsqueda Fácil</CardTitle>
                <CardDescription className="text-base">
                  Filtra por categorías, precios y ubicación para encontrar
                  exactamente lo que buscas.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary/20 p-8 shadow-inner lg:aspect-auto lg:h-full">
          {/* Placeholder for an illustrative image or composition */}
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <Store className="mb-6 h-32 w-32 opacity-20" />
            <p className="font-bold text-2xl opacity-40">
              Tu Ciudad, Tu Mercado
            </p>
          </div>
        </div>
      </section>

      <RecentProducts data={recentProducts} />
      {/* For Businesses Call to Action */}
      <section className="relative overflow-hidden rounded-3xl px-6 py-20 text-center shadow-2xl md:px-12 md:py-32">
        {/* Side glows */}
        <div className="absolute top-1/2 left-0 h-[420px] w-[420px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute top-1/2 right-0 h-[420px] w-[420px] translate-x-1/3 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>

          <h2 className="text-balance font-bold text-3xl tracking-tight md:text-5xl">
            Lleva tu negocio al siguiente nivel digital
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            No te quedes fuera. Únete a la plataforma líder de comercio local y
            empieza a vender más hoy mismo. Planes diseñados para crecer
            contigo.
          </p>

          <div className="grid gap-8 pt-8 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-bold text-xl">Visibilidad</h3>
              <p className="text-muted-foreground">
                Aparece en búsquedas locales y destaca ante miles de vecinos.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl">Catálogo Online</h3>
              <p className="text-muted-foreground">
                Sube tus productos fácilmente y compártelos en redes sociales.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-xl">Estadísticas</h3>
              <p className="text-muted-foreground">
                Conoce qué productos gustan más y optimiza tus ventas.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Button
              className="gap-2 shadow-primary/20 shadow-xl transition-all hover:scale-105"
              asChild
            >
              <Link href="/auth/sign-up">
                Registrar mi Comercio GRATIS
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-4 text-muted-foreground text-sm">
              Pago por suscripción mensual • Cancelación en cualquier momento
              desde Mercado Pago
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
