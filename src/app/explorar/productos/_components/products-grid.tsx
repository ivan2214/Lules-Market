import { Package, ShoppingBag, Sparkles } from "lucide-react";
import { PaginationControls } from "@/features/explorar/_components/pagination-controls";

import type { ProductModel } from "@/server/modules/products/model";
import { EmptyStateCustomMessage } from "@/shared/components/empty-state/empty-state-custom-message";
import EmptyStateSearch from "@/shared/components/empty-state/empty-state-search";
import { ProductCard } from "@/shared/components/product-card";

type ProductsGridProps = {
  hasFilters: boolean;
  currentPage: number;
  currentLimit: number;
  productsData: ProductModel.ListAllOutput;
};

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  hasFilters,
  currentLimit,
  currentPage,
  productsData,
}) => {
  const { products, total } = productsData || {};

  const totalPages = Math.ceil(total / currentLimit);

  if (!products?.length || !total || !productsData || !products) {
    hasFilters ? (
      <EmptyStateSearch
        title="No se encontraron productos"
        description="Por favor, intenta con otros filtros."
        typeExplorer="productos"
        className="mx-auto"
      />
    ) : (
      <EmptyStateCustomMessage
        title="No hay productos"
        description="Registra tu primer producto"
        className="mx-auto"
        icons={[ShoppingBag, Sparkles, Package]}
      />
    );
  }

  return (
    <section className="mx-auto flex flex-col gap-8">
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
      <section className="flex justify-center">
        <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      </section>
    </section>
  );
};
