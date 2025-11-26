import { Suspense } from "react";
import {
  getCategories,
  getPublicBusinesses,
  getPublicProducts,
} from "@/app/actions/public-actions";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
import { LimitSelector } from "@/components/shared/limit-selector";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ActiveFilters } from "../components/active-filters";
import { BusinessesPills } from "../components/businesses-pills";
import { CategoryPills } from "../components/category-pills";
import { SearchAndFilters } from "../components/search-and-filters";
import { ProductsGrid, ProductsGridSkeleton } from "./components/products-grid";

type SearchParams = {
  search?: string;
  category?: string;
  businessId?: string;
  page?: string;
  limit?: string;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
  minRating?: string;
};

export default async function ProductosPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { limit, page, search, sortBy, minRating, category, businessId } =
    (await searchParams) || {};

  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;

  const { products, total } = await getPublicProducts({
    category,
    search,
    sortBy,
    limit: currentLimit,
    page: currentPage,
    minRating: minRating ? parseInt(minRating, 10) : undefined,
    businessId,
  });

  const totalPages = Math.ceil(total / currentLimit);
  const categories = await getCategories();

  const { businesses } = await getPublicBusinesses();

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

      {/* Category Pills */}
      <section>
        <h2 className="mb-2 font-bold text-2xl">Categorias</h2>
        <CategoryPills typeExplorer="productos" categories={categories} />
      </section>

      {/* Business Pills */}
      <section>
        <h2 className="mb-2 font-bold text-2xl">Comercios</h2>
        <BusinessesPills
          businessId={businessId}
          typeExplorer="productos"
          businesses={businesses}
        />
      </section>

      {/* ACTIVE FILTERS */}
      {!!(await searchParams) && (
        <ActiveFilters
          typeExplorer="productos"
          params={{
            search,
            category,
            page,
            businessId,
            limit,
            sortBy,
            minRating,
          }}
          businesses={businesses}
        />
      )}

      {/* Results Count and Limit Selector */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando {products.length} de {total} productos
        </p>
        <LimitSelector
          currentLimit={currentLimit}
          total={total}
          currentPage={currentPage}
        />
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <Suspense
            key={JSON.stringify(await searchParams)}
            fallback={<ProductsGridSkeleton />}
          >
            <ProductsGrid products={products} />
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
          title="No se encontraron productos"
          description="Por favor, intenta con otros filtros."
          typeExplorer="productos"
        />
      )}
    </>
  );
}
