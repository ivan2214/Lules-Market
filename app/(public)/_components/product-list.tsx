import type { ProductWithRelations } from "@/db/types";
import { ProductCard } from "@/shared/components/product-card";

export function ProductList({
  products,
}: {
  products: ProductWithRelations[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
