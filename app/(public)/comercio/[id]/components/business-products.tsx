import type { ProductDTO } from "@/app/data/product/product.dto";
import { ProductGrid } from "@/components/public/product-list";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  products?: ProductDTO[] | null;
};

export function BusinessProducts({ products }: Props) {
  return (
    <div>
      <h2 className="mb-6 font-bold text-2xl">Productos</h2>
      {!products || !products.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Este negocio aún no tiene productos publicados
            </p>
          </CardContent>
        </Card>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
