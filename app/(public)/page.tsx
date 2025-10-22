import type { Metadata } from "next";
import Link from "next/link";
import { CarrouselProducts } from "@/components/carrousel-products";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import type { Product } from "@/types";

// Metadata para SEO
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
        url: "https://lules-market.vercel.app/og-image.jpg",
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
    images: ["https://lules-market.vercel.app/og-image.jpg"],
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
  const featuredProducts = await prisma.product.findMany({
    where: {
      active: true,
    },
    include: {
      business: {
        include: {
          logo: true,
          coverImage: true,
        },
      },
      images: true,
      productView: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allProducts = await prisma.product.findMany({
    where: {
      active: true,
    },
    include: {
      business: {
        include: {
          logo: true,
          coverImage: true,
        },
      },
      images: true,
      productView: true,
    },
  });

  const allCategories = allProducts.map(
    (product) => product.category?.toLowerCase() || "",
  );
  const uniqueCategories = [...new Set(allCategories)];

  const productsByCategory = uniqueCategories.splice(0, 10).reduce(
    (acc, category) => {
      acc[category] = allProducts.filter(
        (product) => product.category?.toLowerCase() === category.toLowerCase(),
      );
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  return (
    <div className="mx-auto flex flex-col p-5">
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-5 md:py-20">
          <div className="mb-8 flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-start gap-2">
              <h2 className="font-bold text-2xl tracking-tight md:text-3xl">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground text-sm md:text-lg">
                Descubre lo que ofrecen los comercios locales
              </p>
            </div>
            <Button asChild>
              <Link href="/explorar">Ver Todos</Link>
            </Button>
          </div>

          <CarrouselProducts products={featuredProducts} />
        </section>
      )}

      {Object.entries(productsByCategory).map(([category, products]) => (
        <section key={category} className="py-5 md:py-20">
          <div className="mb-8 flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bold text-3xl tracking-tight">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
            </div>
            <Button asChild>
              <Link href={`/explorar?category=${category}`}>
                Ver productos por{" "}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Link>
            </Button>
          </div>
          <CarrouselProducts products={products} />
        </section>
      ))}
    </div>
  );
}
