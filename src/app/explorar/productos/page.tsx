import { listAllBusiness } from "@/data/business/get";
import { listAllCategories } from "@/data/categories/get";
import { listAllProducts } from "@/data/products/get";
import { ActiveFilters } from "@/features/explorar/_components/active-filters";
import { ResultsCountAndLimitSelector } from "@/features/explorar/_components/results-count-and-limit-selector";
import { SearchAndFilters } from "@/features/explorar/_components/search-and-filters";
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
