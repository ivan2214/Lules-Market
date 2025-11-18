import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  DynamicStats,
  StatsSkeletons,
} from "@/components/sections/dynamic-stats";
import {
  BusinessesSkeletons,
  FeaturedBusinesses,
} from "@/components/sections/featured-businesses";
import {
  PostsSkeletons,
  RecentPosts,
} from "@/components/sections/recent-posts";
import {
  ProductsSkeletons,
  RecentProducts,
} from "@/components/sections/recent-products";
import { Button } from "@/components/ui/button";

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

export default function HomePage() {
  // ✅ NO database queries here - they're all moved into Suspense boundaries
  return (
    <main className="container mx-auto px-4 py-8 lg:p-0">
      {/* Hero Section - Completely static */}
      <section className="mb-12 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-8 md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-balance font-bold text-4xl tracking-tight md:text-5xl lg:text-6xl">
            Conecta con tu comunidad local
          </h1>
          <p className="mb-8 text-balance text-lg text-muted-foreground md:text-xl">
            Descubre productos, servicios y comercios cerca de ti. Comparte
            opiniones y encuentra lo que necesitas.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/explorar/comercios">
                Explorar Comercios
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/explorar/productos">Ver Productos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section - Dynamic, wrapped in Suspense */}
      <Suspense fallback={<StatsSkeletons />}>
        <DynamicStats />
      </Suspense>

      {/* Featured Businesses - Dynamic, wrapped in Suspense */}
      <Suspense fallback={<BusinessesSkeletons />}>
        <FeaturedBusinesses />
      </Suspense>

      {/* Recent Products - Dynamic, wrapped in Suspense */}
      <Suspense fallback={<ProductsSkeletons />}>
        <RecentProducts />
      </Suspense>

      {/* Recent posts - Dynamic, wrapped in Suspense */}
      <Suspense fallback={<PostsSkeletons />}>
        <RecentPosts />
      </Suspense>

      {/* CTA Section - Static */}
      <section className="rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-balance font-bold text-3xl md:text-4xl">
            ¿Tienes un negocio?
          </h2>
          <p className="mb-8 text-balance text-lg opacity-90">
            Únete a nuestra comunidad de comercios locales y llega a más
            clientes en tu zona.
          </p>
          <Button size="lg" variant="secondary" className="gap-2">
            Registrar mi comercio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}
