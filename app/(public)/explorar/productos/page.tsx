import { orpcTanstack } from "@/lib/orpc";
import { getQueryClient, HydrateClient } from "@/lib/query/hydration";
import { ActiveFilters } from "../components/active-filters";
import { ResultsCountAndLimitSelector } from "../components/results-count-and-limit-selector";
import { SearchAndFilters } from "../components/search-and-filters";
import { ProductsGrid } from "./components/products-grid";

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

  queryClient.prefetchQuery(
    orpcTanstack.products.listAllProducts.queryOptions({
      input: {
        category: decodeURIComponent(category || ""),
        search,
        sort: sortBy,
        limit: currentLimit,
        page: currentPage,
        businessId,
      },
    }),
  );

  queryClient.prefetchQuery(
    orpcTanstack.business.listAllBusinesses.queryOptions(),
  );

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
            category: decodeURIComponent(category || ""),
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
      />

      {/* Products Grid */}
      <HydrateClient client={queryClient}>
        <ProductsGrid
          hasFilters={hasFilters}
          currentLimit={currentLimit}
          currentPage={currentPage}
          search={search}
          category={decodeURIComponent(category || "")}
          businessId={businessId}
          sort={sortBy}
        />
      </HydrateClient>
    </>
  );
}
