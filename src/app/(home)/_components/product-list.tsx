import { ProductCard } from "@/shared/components/product-card";
import type { ProductDto } from "@/shared/utils/dto";

export function ProductList({ products }: { products: ProductDto[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
