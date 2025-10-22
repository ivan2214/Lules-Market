import type { Product } from "@/types";
import { ProductPublicCard } from "./product-public-card";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductPublicCard key={product.id} product={product} />
      ))}
    </div>
  );
}
