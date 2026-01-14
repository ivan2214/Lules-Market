import { ActiveFilters } from "@/features/explorar/_components/active-filters";
import { ResultsCountAndLimitSelector } from "@/features/explorar/_components/results-count-and-limit-selector";
import { SearchAndFilters } from "@/features/explorar/_components/search-and-filters";
import { api } from "@/lib/eden";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { ProductsGrid } from "./_components/products-grid";

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

  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "products",
      { businessId, category, limit, page, search, sortBy },
    ],
    queryFn: async () => {
      const { data, error } = await api.products.public.list.get({
        query: {
          businessId,
          category,
          limit: currentLimit,
          page: currentPage,
          search,
          sort: sortBy,
        },
      });
      if (error) throw error;
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const { data, error } = await api.business.public["list-all"].get();
      if (error) throw error;
      return data;
    },
  });

  const hasFilters = Object.entries((await searchParams) || {}).length > 0;

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Explorar Productos</h1>
        <p className="text-lg text-muted-foreground">
          Descubre productos de comercios locales cerca de ti
        </p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters params={await searchParams} typeExplorer="productos" />

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
      />

      {/* Products Grid */}
      <HydrateClient client={queryClient}>
        <ProductsGrid
          hasFilters={hasFilters}
          currentLimit={currentLimit}
          currentPage={currentPage}
          search={search}
          category={category}
          businessId={businessId}
          sort={sortBy}
        />
      </HydrateClient>
    </>
  );
}
