import { ArrowDownAZ, ArrowUpAZ, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getPublicBusinesses,
  getPublicProducts,
} from "@/app/actions/public-actions";
import { ProductGrid } from "@/components/public/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSearchUrl } from "@/lib/utils";

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

  const { businesses } = await getPublicBusinesses();

  return (
    <>
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
        <div className="mt-4 sm:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {params.sort === "price_asc" ? (
                  "Precio: Menor a Mayor"
                ) : params.sort === "price_desc" ? (
                  "Precio: Mayor a Menor"
                ) : params.sort === "name_asc" ? (
                  <>
                    <ArrowDownAZ className="h-4 w-4" /> Nombre: A-Z
                  </>
                ) : params.sort === "name_desc" ? (
                  <>
                    <ArrowUpAZ className="h-4 w-4" /> Nombre: Z-A
                  </>
                ) : (
                  "Ordenar por"
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={createSearchUrl(params, { sort: "name_asc" })}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" /> Nombre: A-Z
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={createSearchUrl(params, { sort: "name_desc" })}>
                  <ArrowUpAZ className="mr-2 h-4 w-4" /> Nombre: Z-A
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={createSearchUrl(params, { sort: "price_asc" })}>
                  Precio: Menor a Mayor
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={createSearchUrl(params, { sort: "price_desc" })}>
                  Precio: Mayor a Menor
                </Link>
              </DropdownMenuItem>
              {params.sort && (
                <DropdownMenuItem asChild>
                  <Link href={createSearchUrl(params, { sort: undefined })}>
                    Quitar ordenamiento
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filters */}
      {(params.search ||
        params.category ||
        params.businessId ||
        params.sort) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-sm">
            Filtros activos:
          </span>
          {params.search && (
            <Badge variant="secondary">
              Búsqueda: {params.search}
              <Link
                href={createSearchUrl(params, { search: undefined })}
                className="ml-2"
              >
                ×
              </Link>
            </Badge>
          )}
          {params.category && (
            <Badge variant="secondary">
              Categoría: {params.category}
              <Link
                href={createSearchUrl(params, { category: undefined })}
                className="ml-2"
              >
                ×
              </Link>
            </Badge>
          )}
          {params.businessId && (
            <Badge variant="secondary">
              Negocio:{" "}
              {businesses.find((b) => b.id === params.businessId)?.name ||
                params.businessId}
              <Link
                href={createSearchUrl(params, { businessId: undefined })}
                className="ml-2"
              >
                ×
              </Link>
            </Badge>
          )}
          {params.sort && (
            <Badge variant="secondary">
              Ordenamiento:{" "}
              {params.sort === "price_asc"
                ? "Precio: Menor a Mayor"
                : params.sort === "price_desc"
                  ? "Precio: Mayor a Menor"
                  : params.sort === "name_asc"
                    ? "Nombre: A-Z"
                    : "Nombre: Z-A"}
              <Link
                href={createSearchUrl(params, { sort: undefined })}
                className="ml-2"
              >
                ×
              </Link>
            </Badge>
          )}
          {(params.search ||
            params.category ||
            params.businessId ||
            params.sort) && (
            <Button variant="ghost" size="sm" asChild className="ml-auto">
              <Link href="/explorar">Limpiar todos</Link>
            </Button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold text-lg">
              No se encontraron productos
            </h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Intenta con otros términos de búsqueda
            </p>
            <Button asChild className="mt-4 bg-transparent" variant="outline">
              <Link href="/explorar">Ver todos los productos</Link>
            </Button>
          </CardContent>
        </Card>
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
    </>
  );
}
