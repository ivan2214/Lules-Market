import type { Metadata } from "next";
import Link from "next/link";
import {
  getPublicBusinesses,
  getPublicProducts,
} from "@/app/actions/public-actions";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
import { ProductGrid } from "@/components/public/product-grid";
import { Button } from "@/components/ui/button";
import { createSearchUrl } from "@/lib/utils";
import { ActiveFilters } from "./components/active-filters";
import { Order } from "./components/order";

export const metadata: Metadata = {
  title: "Explorar Productos - Lules Market",
  description:
    "Descubre productos locales de calidad. Explora por categorías y encuentra lo que necesitas cerca de ti.",
  keywords:
    "explorar productos, productos locales, categorías, marketplace local",
  openGraph: {
    title: "Explorar Productos - Lules Market",
    description:
      "Descubre productos locales de calidad. Explora por categorías y encuentra lo que necesitas cerca de ti.",
    url: "https://lules-market.vercel.app/explorar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explorar Productos - Lules Market",
    description:
      "Descubre productos locales de calidad. Explora por categorías y encuentra lo que necesitas cerca de ti.",
  },
  alternates: {
    canonical: "https://lules-market.vercel.app/explorar",
  },
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
    businessId?: string;
    sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { products, total, pages } = await getPublicProducts({
    search: params.search,
    category: params.category,
    page,
    limit: 24,
    businessId: params.businessId,
    sort: params.sort,
  });

  const hasParams = Object.keys(params).length > 0;
  const { businesses } = await getPublicBusinesses();

  return (
    <section className="mx-auto w-full px-4 py-5">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Explorar Productos
          </h1>
          <p className="mt-2 text-muted-foreground">
            {total}{" "}
            {total === 1 ? "producto encontrado" : "productos encontrados"}
          </p>
        </div>

        {/* Ordenamiento */}
        <Order params={params} />
      </div>

      {/* Active Filters */}
      {(params.search ||
        params.category ||
        params.businessId ||
        params.sort) && (
        <ActiveFilters params={params} businesses={businesses} />
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <section className="mx-auto flex w-full items-center justify-center">
          <EmptyStateSearch
            title={
              hasParams
                ? "No se encontraron productos"
                : "No hay productos disponibles"
            }
            description={
              hasParams
                ? "Intenta con otros términos de búsqueda"
                : "No hay productos disponibles"
            }
          />
        </section>
      ) : (
        <>
          <ProductGrid products={products} />

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {page > 1 && (
                <Button asChild variant="outline">
                  <Link
                    href={createSearchUrl(params, {
                      page: String(page - 1),
                    })}
                  >
                    Anterior
                  </Link>
                </Button>
              )}
              <div className="flex items-center gap-2">
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    asChild
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                  >
                    <Link
                      href={createSearchUrl(params, {
                        page: String(p),
                      })}
                    >
                      {p}
                    </Link>
                  </Button>
                ))}
              </div>
              {page < pages && (
                <Button asChild variant="outline">
                  <Link
                    href={createSearchUrl(params, {
                      page: String(page + 1),
                    })}
                  >
                    Siguiente
                  </Link>
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
