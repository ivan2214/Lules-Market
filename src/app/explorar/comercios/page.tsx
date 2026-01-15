import { listAllBusiness } from "@/data/business/get";
import { listAllCategories } from "@/data/categories/get";
import { ActiveFilters } from "@/features/explorar/_components/active-filters";
import { ResultsCountAndLimitSelector } from "@/features/explorar/_components/results-count-and-limit-selector";
import { SearchAndFilters } from "@/features/explorar/_components/search-and-filters";
import { BusinessGrid } from "./_components/business-grid";

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
