import type { Metadata } from "next";
import { listAllBusiness } from "@/data/business/get";
import { listAllCategories } from "@/data/categories/get";
import { listAllProducts } from "@/data/products/get";
import { env } from "@/env/server";
import { ActiveFilters } from "@/features/explorar/_components/active-filters";
import { ResultsCountAndLimitSelector } from "@/features/explorar/_components/results-count-and-limit-selector";
import { SearchAndFilters } from "@/features/explorar/_components/search-and-filters";
import { ItemListSchema } from "@/shared/components/structured-data";
import { ProductsGrid } from "./_components/products-grid";

export const metadata: Metadata = {
  title: "Productos en Lules - Encontrá lo que buscás cerca de vos",
  description:
    "Explorá productos de comercios locales en Lules, Tucumán. Alimentos, ropa, electrónica, servicios y más. Comprá local y apoyá a tu comunidad.",
  keywords: [
    "productos Lules",
    "comprar en Lules",
    "productos locales Tucumán",
    "tiendas Lules",
    "ofertas Lules",
    "comercios Lules productos",
    "que comprar en Lules",
    "productos cerca de mi Lules",
  ],
  openGraph: {
    title: "Productos en Lules - Lules Market",
    description:
      "Explorá productos de comercios locales en Lules. Encontrá alimentos, ropa, servicios y más.",
    type: "website",
  },
  alternates: {
    canonical: "/explorar/productos",
  },
};

type SearchParams = {
  search?: string;
  category?: string;
  businessId?: string;
  page?: string;
  limit?: string;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { limit, page, search, sortBy, category, businessId } =
    (await searchParams) || {};

  const params = await searchParams;

  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;

  const [businessesData, productsData, categories] = await Promise.all([
    listAllBusiness(),
    listAllProducts(params),
    listAllCategories(),
  ]);

  const hasFilters = Object.entries((await searchParams) || {}).length > 0;

  return (
    <section className="mx-auto flex min-h-screen flex-col gap-3">
      {/* Datos estructurados para listado de productos */}
      {productsData.products.length > 0 && (
        <ItemListSchema
          name="Productos en Lules - Lules Market"
          description="Listado de productos de comercios locales en Lules, Tucumán"
          items={productsData.products.slice(0, 10).map((product, index) => ({
            name: product.name,
            url: `${env.APP_URL}/producto/${product.id}`,
            position: index + 1,
            image: product.images?.[0]?.url,
          }))}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl">Explorar Productos</h1>
        <p className="text-lg text-muted-foreground">
          Descubre productos de comercios locales cerca de ti
        </p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        params={await searchParams}
        typeExplorer="productos"
        businesses={businessesData.businesses}
        categories={categories}
      />

      {/* ACTIVE FILTERS */}
      {hasFilters && (
        <ActiveFilters
          typeExplorer="productos"
          params={{
            search,
            category,
            page,
            businessId,
            limit,
            sortBy,
          }}
          businesses={businessesData.businesses}
        />
      )}

      {/* Results Count and Limit Selector */}
      <ResultsCountAndLimitSelector
        typeExplorer="productos"
        currentLimit={currentLimit}
        params={{
          search,
          category,
          page,
          businessId,
          limit,
          sortBy,
        }}
        currentPage={currentPage}
        businessesData={businessesData}
        productsData={productsData}
      />

      {/* Products Grid */}

      <ProductsGrid
        hasFilters={hasFilters}
        currentLimit={currentLimit}
        currentPage={currentPage}
        productsData={productsData}
      />
    </section>
  );
}
