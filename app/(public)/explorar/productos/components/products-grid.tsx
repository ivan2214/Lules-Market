import type { ProductDTO } from "@/app/data/product/product.dto";
import { ProductPublicCard } from "@/components/public/product-public-card";

type ProductsGridProps = {
  products: ProductDTO[];
};

export const ProductsGrid: React.FC<ProductsGridProps> = ({ products }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductPublicCard key={product.id} product={product} />
      ))}
    </div>
  );
};
