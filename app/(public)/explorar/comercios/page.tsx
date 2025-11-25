import { Suspense } from "react";
import {
  getCategories,
  getPublicBusinesses,
} from "@/app/actions/public-actions";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
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

  const { businesses, total } = await getPublicBusinesses({
    category,
    search,
    sortBy,
    limit: limit ? parseInt(limit, 10) : undefined,
    page: page ? parseInt(page, 10) : undefined,
    minRating: minRating ? parseInt(minRating, 10) : undefined,
  });
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

      {/* Results Count */}
      <p className="mb-4 text-muted-foreground text-sm">
        Mostrando {total} comercios
      </p>

      {/* Businesses Grid */}
      {businesses.length > 0 ? (
        <Suspense fallback={<BusinessGridSkeleton />}>
          <BusinessGrid businesses={businesses} />
        </Suspense>
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
