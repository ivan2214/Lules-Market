"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Sparkles } from "lucide-react";
import { EmptyStateCustomMessage } from "@/components/empty-state/empty-state-custom-message";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
import { ProductCard } from "@/components/public/product-card";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { orpcTanstack } from "@/lib/orpc";

type ProductsGridProps = {
  currentPage: number;
  hasFilters: boolean;
  currentLimit: number;
};

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  hasFilters,
  currentLimit,
  currentPage,
}) => {
  const {
    data: { products, total },
  } = useSuspenseQuery(orpcTanstack.products.listAllProducts.queryOptions());

  const totalPages = Math.ceil(total / currentLimit);

  if (!products.length) {
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
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
};
