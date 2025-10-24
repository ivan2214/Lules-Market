import { Box, ShoppingCart, Store, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CarrouselProducts } from "@/components/carrousel-products";
import { EmptyStateCustomMessage } from "@/components/empty-state/empty-state-custom-message";
import { Button } from "@/components/ui/button";
import { ProductDAL } from "../data/product/product.dal";

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
  const productDAL = await ProductDAL.public();
  const featuredProducts = await productDAL.listFeaturedProducts();

  const productsByCategory = await productDAL.listProductsGroupedByCategory();

  return (
    <div className="mx-auto flex flex-col gap-y-20 p-5 md:py-10">
      {/* Featured Products */}
      {featuredProducts.length > 0 ? (
        <section>
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
      ) : (
        <EmptyStateCustomMessage
          title="No hay productos destacados"
          description="No hay productos destacados"
          icons={[ShoppingCart, Box, User]}
        />
      )}

      {Object.entries(productsByCategory).length > 0 ? (
        Object.entries(productsByCategory).map(([category, products]) => (
          <section key={category}>
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
            {products.length > 0 ? (
              <CarrouselProducts products={products} />
            ) : (
              <EmptyStateCustomMessage
                title="No hay productos disponibles"
                description={`No hay productos disponibles por ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                icons={[Box, Store]}
              />
            )}
          </section>
        ))
      ) : (
        <section className="flex items-center justify-center">
          <EmptyStateCustomMessage
            title="No hay productos disponibles"
            description="No hay productos disponibles por categoría"
            icons={[Box, Store]}
          />
        </section>
      )}
    </div>
  );
}
