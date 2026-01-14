import { ActiveFilters } from "@/features/explorar/_components/active-filters";
import { ResultsCountAndLimitSelector } from "@/features/explorar/_components/results-count-and-limit-selector";
import { SearchAndFilters } from "@/features/explorar/_components/search-and-filters";
import { api } from "@/lib/eden";
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

  await queryClient.prefetchQuery({
    queryKey: ["businesses", category, limit, page, search, sortBy],
    queryFn: async () => {
      const { data, error } = await api.business.public["list-all"].get({
        query: {
          category,
          limit: currentLimit,
          page: currentPage,
          search,
          sortBy,
        },
      });
      if (error) throw error;
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await api.category.public["list-all"].get();
      if (error) throw error;
      return data;
    },
  });

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
        currentPage={currentPage}
        params={{
          search,
          category,
          page,
          limit,
          sortBy,
        }}
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
