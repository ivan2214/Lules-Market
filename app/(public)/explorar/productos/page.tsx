import { Box, Package, ShoppingCart } from "lucide-react";
import {
  getCategories,
  getPublicBusinesses,
  getPublicProducts,
} from "@/app/actions/public-actions";
import { EmptyStateCustomMessage } from "@/components/empty-state/empty-state-custom-message";
import { ActiveFilters } from "../components/active-filters";
import { BusinessesPills } from "../components/businesses-pills";
import { CategoryPills } from "../components/category-pills";
import { SearchAndFilters } from "../components/search-and-filters";
import { ProductsGrid } from "./components/products-grid";

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

  const { products, total } = await getPublicProducts({
    category,
    search,
    sortBy,
    limit: limit ? parseInt(limit, 10) : undefined,
    page: page ? parseInt(page, 10) : undefined,
    minRating: minRating ? parseInt(minRating, 10) : undefined,
    businessId,
  });

  const categories = await getCategories();

  const { businesses } = await getPublicBusinesses();

  return (
    <main className="container px-4 py-8">
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

      {/* Results Count */}
      <p className="mb-4 text-muted-foreground text-sm">
        Mostrando {products.length} de {total} productos
      </p>

      {/* Products Grid */}
      {products.length > 0 ? (
        <ProductsGrid products={products} />
      ) : (
        <EmptyStateCustomMessage
          title="No se encontraron productos"
          description="Por favor, intenta con otros filtros."
          icons={[Package, Box, ShoppingCart]}
          className="mx-auto w-full flex-1"
        />
      )}
    </main>
  );
}
