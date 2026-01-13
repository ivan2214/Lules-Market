"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Sparkles } from "lucide-react";
import { PaginationControls } from "@/app/(public)/explorar/_components/pagination-controls";
import { api } from "@/lib/eden";
import { EmptyStateCustomMessage } from "@/shared/components/empty-state/empty-state-custom-message";
import EmptyStateSearch from "@/shared/components/empty-state/empty-state-search";
import { ProductCard } from "@/shared/components/product-card";

type ProductsGridProps = {
  currentPage: number;
  hasFilters: boolean;
  currentLimit: number;
  search?: string;
  category?: string;
  businessId?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  hasFilters,
  currentLimit,
  currentPage,
  search,
  category,
  businessId,
  sort,
}) => {
  const { data } = useSuspenseQuery({
    queryFn: async () => {
      const { data, error } = await api.products.public.list.get({
        query: {
          businessId,
          category,
          limit: currentLimit,
          page: currentPage,
          search,
          sort,
        },
      });
      if (error) throw error;
      return data;
    },
    queryKey: [
      "products",
      businessId,
      category,
      currentLimit,
      currentPage,
      search,
      sort,
    ],
  });

  const { products, total } = data || {};

  const totalPages = Math.ceil(total || 0 / currentLimit);

  if (!products?.length || !total || !data || !products) {
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
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
};
