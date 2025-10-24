import type { ProductDTO } from "@/app/data/product/product.dto";

import { ProductPublicCard } from "./product-public-card";

interface ProductGridProps {
  products: ProductDTO[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductPublicCard key={product.id} product={product} />
      ))}
    </div>
  );
}
