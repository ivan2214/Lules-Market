import type { ProductDTO } from "@/app/data/product/product.dto";

import { ProductPublicCard } from "./product-public-card";

interface ProductGridProps {
  products: ProductDTO[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid place-items-center gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
      {products.map((product) => (
        <ProductPublicCard
          isCarrousel={false}
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}
