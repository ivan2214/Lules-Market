import { Building, Package, Sparkles } from "lucide-react";
import { Suspense } from "react";
import { EmptyStateCustomMessage } from "@/components/empty-state/empty-state-custom-message";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
import { LimitSelector } from "@/components/shared/limit-selector";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { orpc } from "@/lib/orpc";
import { ActiveFilters } from "../components/active-filters";
import { SearchAndFilters } from "../components/search-and-filters";
import { BusinessGrid, BusinessGridSkeleton } from "./components/business-grid";

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

  const { businesses, total } = await orpc.business.listAllBusinesses({
    category,
    search,
    sortBy,
    limit: currentLimit,
    page: currentPage,
  });

  const totalPages = Math.ceil(total / currentLimit);
  const categories = await orpc.category.listAllCategories();

  const hasFilters = Object.entries((await searchParams) || {}).length > 0;
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Explorar Comercios</h1>
        <p className="text-lg text-muted-foreground">
          Descubre negocios locales y apoya a tu comunidad
        </p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        categories={categories}
        businesses={businesses}
        typeExplorer="comercios"
        params={await searchParams}
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
          businesses={businesses}
        />
      )}

      {/* Results Count and Limit Selector */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando {businesses.length} de {total} comercios
        </p>
        <LimitSelector currentLimit={currentLimit} total={total} />
      </div>

      {/* Businesses Grid */}
      {businesses.length > 0 ? (
        <>
          <Suspense
            key={JSON.stringify(await searchParams)}
            fallback={<BusinessGridSkeleton />}
          >
            <BusinessGrid businesses={businesses} />
          </Suspense>
          <div className="mt-8 flex justify-center">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>
        </>
      ) : hasFilters ? (
        <EmptyStateSearch
          title="No se encontraron comercios"
          description="Por favor, intenta con otros filtros."
          typeExplorer="comercios"
          className="mx-auto"
        />
      ) : (
        <EmptyStateCustomMessage
          title="No hay comercios"
          description="Registra tu primer comercio"
          className="mx-auto"
          icons={[Building, Sparkles, Package]}
        />
      )}
    </>
  );
}
