import type { Metadata } from "next";
import { listAllBusiness } from "@/data/business/get";
import { listAllCategories } from "@/data/categories/get";
import { env } from "@/env/server";
import { ActiveFilters } from "@/features/explorar/_components/active-filters";
import { ResultsCountAndLimitSelector } from "@/features/explorar/_components/results-count-and-limit-selector";
import { SearchAndFilters } from "@/features/explorar/_components/search-and-filters";
import { ItemListSchema } from "@/shared/components/structured-data";
import { BusinessGrid } from "./_components/business-grid";

export const metadata: Metadata = {
  title: "Comercios en Lules - Negocios locales cerca de vos",
  description:
    "Descubrí comercios y negocios locales en Lules, Tucumán. Restaurantes, tiendas, servicios profesionales y emprendimientos. Apoyá a tu comunidad.",
  keywords: [
    "comercios Lules",
    "negocios Lules",
    "tiendas Lules",
    "emprendimientos Lules",
    "negocios locales Tucumán",
    "donde comprar en Lules",
    "comercios cerca de mi Lules",
    "restaurantes Lules",
    "servicios Lules",
  ],
  openGraph: {
    title: "Comercios en Lules - Lules Market",
    description:
      "Descubrí comercios y negocios locales en Lules. Restaurantes, tiendas, servicios y más.",
    type: "website",
  },
  alternates: {
    canonical: `${env.APP_URL}/explorar/comercios`,
  },
};

type SearchParams = {
  search?: string;
  sortBy?: "newest" | "oldest";
  category?: string;
  page?: string;
  limit?: string;
};

export default async function ComerciosPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { limit, page, search, sortBy, category } = (await searchParams) || {};

  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;

  const params = await searchParams;

  const [businessesData, categories] = await Promise.all([
    listAllBusiness(params),
    listAllCategories(),
  ]);

  const hasFilters = Object.entries((await searchParams) || {}).length > 0;

  return (
    <section className="mx-auto flex min-h-screen flex-col gap-3">
      {/* Datos estructurados para listado de comercios */}
      {businessesData.businesses.length > 0 && (
        <ItemListSchema
          name="Comercios en Lules - Lules Market"
          description="Listado de comercios y negocios locales en Lules, Tucumán"
          items={businessesData.businesses
            .slice(0, 10)
            .map((business, index) => ({
              name: business.name,
              url: `${env.APP_URL}/comercio/${business.id}`,
              position: index + 1,
              image: business.logoUrl ?? undefined,
            }))}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl">Explorar Comercios</h1>
        <p className="text-lg text-muted-foreground">
          Descubre negocios locales y apoya a tu comunidad
        </p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        typeExplorer="comercios"
        params={await searchParams}
        businesses={businessesData.businesses}
        categories={categories}
      />

      {/* ACTIVE FILTERS */}
      {hasFilters && (
        <ActiveFilters
          typeExplorer="comercios"
          params={{
            search,
            category,
            page,
            limit,
            sortBy,
          }}
          businesses={businessesData.businesses}
        />
      )}

      {/* Results Count and Limit Selector */}
      <ResultsCountAndLimitSelector
        typeExplorer="comercios"
        currentLimit={currentLimit}
        currentPage={currentPage}
        params={{
          search,
          category,
          page,
          limit,
          sortBy,
        }}
        businessesData={businessesData}
      />

      <BusinessGrid
        currentLimit={currentLimit}
        currentPage={currentPage}
        hasFilters={hasFilters}
        businessesData={businessesData}
      />
    </section>
  );
}
