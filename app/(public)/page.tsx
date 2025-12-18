import {
  ArrowRight,
  Heart,
  Search,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { DynamicStats } from "@/app/(public)/_components/sections/dynamic-stats";
import { FeaturedBusinesses } from "@/app/(public)/_components/sections/featured-businesses";
import { RecentProducts } from "@/app/(public)/_components/sections/recent-products";
import { Button } from "@/app/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import { orpcTanstack } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";

export const metadata: Metadata = {
  title: "Lules Market - Tu Vitrina Digital para Comercios Locales",
  description:
    "Conecta con clientes de tu zona. Publica tus productos, aumenta tu visibilidad y haz crecer tu negocio con nuestra plataforma diseñada para comercios locales.",
  keywords:
    "comercios locales, vitrina digital, productos locales, negocios, emprendedores, marketplace",
  openGraph: {
    title: "Lules Market - Tu Vitrina Digital para Comercios Locales",
    description:
      "Conecta con clientes de tu zona. Publica tus productos, aumenta tu visibilidad y haz crecer tu negocio.",
    url: "https://lules-market.vercel.app",
    siteName: "Lules Market",
    images: [
      {
        url: "https://lules-market.vercel.app/logo.webp",
        width: 1200,
        height: 630,
        alt: "Lules Market - Plataforma para comercios locales",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lules Market - Tu Vitrina Digital para Comercios Locales",
    description:
      "Conecta con clientes de tu zona. Publica tus productos, aumenta tu visibilidad y haz crecer tu negocio.",
    images: ["https://lules-market.vercel.app/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lules-market.vercel.app",
  },
};

export default async function HomePage() {
  await connection();
  const queryClient = getQueryClient();

  queryClient.prefetchQuery(
    orpcTanstack.analytics.getHomePageStats.queryOptions(),
  );

  queryClient.prefetchQuery(
    orpcTanstack.business.featuredBusinesses.queryOptions(),
  );

  queryClient.prefetchQuery(
    orpcTanstack.products.recentProducts.queryOptions(),
  );

  return (
    <main className="container mx-auto px-4 py-8 lg:p-0">
      {/* Hero Section */}
      <section className="relative mb-16 overflow-hidden rounded-3xl bg-linear-to-br from-primary/95 via-primary/80 to-accent/90 px-6 py-20 text-center text-primary-foreground shadow-2xl md:px-12 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-10 mix-blend-overlay" />
        <div className="relative mx-auto max-w-4xl space-y-8">
          <h1 className="text-balance font-extrabold text-4xl tracking-tight drop-shadow-sm md:text-6xl lg:text-7xl">
            Conecta con tu comunidad local
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-lg text-primary-foreground/90 md:text-2xl">
            La plataforma donde los comercios de Lules brillan. Descubre
            productos únicos, apoya a tus vecinos y encuentra todo lo que
            necesitas cerca de casa.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="group h-14 min-w-[200px] gap-2 font-semibold text-lg shadow-lg transition-all hover:scale-105"
              asChild
            >
              <Link href="/explorar/comercios">
                <Search className="h-5 w-5" />
                Explorar Comercios
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 min-w-[200px] gap-2 border-primary-foreground/30 bg-black/10 font-semibold text-lg text-primary-foreground backdrop-blur-sm transition-all hover:bg-black/20 hover:text-white"
              asChild
            >
              <Link href="/explorar/productos">
                Ver Productos
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats - Dynamic */}
      <HydrateClient client={queryClient}>
        <div className="mb-20">
          <DynamicStats />
        </div>

        {/* Featured Businesses */}
        <div className="mb-24">
          <div className="mb-10 text-center">
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-medium text-primary text-sm">
              Destacados
            </span>
            <h2 className="mb-4 text-balance font-bold text-3xl tracking-tight md:text-5xl">
              Comercios que inspiran
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
              Negocios locales comprometidos con la calidad y el servicio.
            </p>
          </div>
          <FeaturedBusinesses />
        </div>
      </HydrateClient>

      {/* For Customers Section */}
      <section className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8">
          <div>
            <span className="mb-2 inline-block rounded-full bg-accent/10 px-4 py-1.5 font-medium text-accent-foreground text-sm">
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

      {/* Recent Products */}
      <HydrateClient client={queryClient}>
        <div className="mb-24 rounded-3xl bg-muted/30 px-6 py-16 md:px-12">
          <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h2 className="mb-2 font-bold text-3xl tracking-tight md:text-4xl">
                Novedades Recientes
              </h2>
              <p className="text-lg text-muted-foreground">
                Los últimos productos agregados por nuestros comercios.
              </p>
            </div>
            <Button
              variant="outline"
              className="group h-12 gap-2 rounded-full border-primary/20 bg-background hover:border-primary/50"
              asChild
            >
              <Link href="/explorar/productos">
                Ver todo el catálogo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <RecentProducts />
        </div>
      </HydrateClient>

      {/* For Businesses Call to Action */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-20 text-center text-white shadow-2xl md:px-12 md:py-32">
        {/* Background Gradients/Effects */}
        <div className="-translate-y-1/2 -translate-x-1/2 absolute top-0 left-0 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl space-y-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <TrendingUp className="h-8 w-8 text-primary-foreground" />
          </div>

          <h2 className="text-balance font-bold text-3xl tracking-tight md:text-5xl">
            Lleva tu negocio al siguiente nivel digital
          </h2>
          <p className="mx-auto max-w-2xl text-balance text-lg text-slate-300 md:text-xl">
            No te quedes fuera. Únete a la plataforma líder de comercio local y
            empieza a vender más hoy mismo. Planes diseñados para crecer
            contigo.
          </p>

          <div className="grid gap-8 pt-8 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xl">Visibilidad</h3>
              <p className="text-slate-400">
                Aparece en búsquedas locales y destaca ante miles de vecinos.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xl">Catálogo Online</h3>
              <p className="text-slate-400">
                Sube tus productos fácilmente y compártelos en redes sociales.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xl">Estadísticas</h3>
              <p className="text-slate-400">
                Conoce qué productos gustan más y optimiza tus ventas.
              </p>
            </div>
          </div>

          <div className="pt-8">
            <Button
              size="lg"
              className="h-14 min-w-[240px] gap-2 rounded-full text-lg shadow-primary/20 shadow-xl transition-all hover:scale-105"
              asChild
            >
              <Link href="/auth/business-setup">
                Registrar mi Comercio GRATIS
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-4 text-slate-400 text-sm">
              No requiere tarjeta de crédito • Cancelación en cualquier momento
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
