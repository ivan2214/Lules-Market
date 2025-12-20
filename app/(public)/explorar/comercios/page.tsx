import { ActiveFilters } from "@/features/(public)/explorar/_components/active-filters";
import { ResultsCountAndLimitSelector } from "@/features/(public)/explorar/_components/results-count-and-limit-selector";
import { SearchAndFilters } from "@/features/(public)/explorar/_components/search-and-filters";
import { orpcTanstack } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
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

  const queryClient = getQueryClient();

  queryClient.prefetchQuery(
    orpcTanstack.business.listAllBusinesses.queryOptions({
      input: {
        category,
        search,
        sortBy,
        limit: currentLimit,
        page: currentPage,
      },
    }),
  );

  queryClient.prefetchQuery(
    orpcTanstack.category.listAllCategories.queryOptions(),
  );

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
      <SearchAndFilters typeExplorer="comercios" params={await searchParams} />

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
        />
      )}

      {/* Results Count and Limit Selector */}
      <ResultsCountAndLimitSelector
        typeExplorer="comercios"
        currentLimit={currentLimit}
      />

      <HydrateClient client={queryClient}>
        <BusinessGrid
          currentLimit={currentLimit}
          currentPage={currentPage}
          hasFilters={hasFilters}
          search={search}
          category={category}
          sortBy={sortBy}
        />
      </HydrateClient>
    </>
  );
}
