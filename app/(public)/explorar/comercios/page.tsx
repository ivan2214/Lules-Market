import { Suspense } from "react";
import {
  getCategories,
  getPublicBusinesses,
} from "@/app/actions/public-actions";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
import { LimitSelector } from "@/components/shared/limit-selector";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { CategoryPills } from "../components/category-pills";
import { SearchAndFilters } from "../components/search-and-filters";
import { BusinessGrid, BusinessGridSkeleton } from "./components/business-grid";

type SearchParams = {
  search?: string;
  sortBy?: string;
  minRating?: string;
  category?: string;
  page?: string;
  limit?: string;
};

export default async function ComerciosPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { limit, page, search, sortBy, minRating, category } =
    (await searchParams) || {};

  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;

  const { businesses, total } = await getPublicBusinesses({
    category,
    search,
    sortBy,
    limit: currentLimit,
    page: currentPage,
    minRating: minRating ? parseInt(minRating, 10) : undefined,
  });

  const totalPages = Math.ceil(total / currentLimit);
  const categories = await getCategories();

  return (
    <main className="container mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Explorar Comercios</h1>
        <p className="text-lg text-muted-foreground">
          Descubre negocios locales y apoya a tu comunidad
        </p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters typeExplorer="comercios" params={await searchParams} />
      {/* Category Pills */}
      <CategoryPills categories={categories} typeExplorer="comercios" />

      {/* Results Count and Limit Selector */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando {businesses.length} de {total} comercios
        </p>
        <LimitSelector
          currentLimit={currentLimit}
          total={total}
          currentPage={currentPage}
        />
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
      ) : (
        <EmptyStateSearch
          title="No se encontraron comercios"
          description="Por favor, intenta con otros filtros."
          typeExplorer="comercios"
        />
      )}
    </main>
  );
}
