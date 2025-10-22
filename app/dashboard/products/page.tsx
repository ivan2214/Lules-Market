import { Package } from "lucide-react";
import Link from "next/link";
import { getBusiness } from "@/app/actions/business-actions";
import { ProductDAL } from "@/app/data/product/product.dal";
import { ProductCard } from "@/components/dashboard/product-card";
import { ProductFormDialog } from "@/components/dashboard/product-form-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { getSubscriptionLimits } from "@/lib/subscription-limits";

export default async function ProductsPage() {
  const productDAL = await ProductDAL.public();
  const [products, business] = await Promise.all([
    productDAL.getProductsByBusinessId(),
    getBusiness(),
  ]);

  if (!business) {
    return null;
  }

  const limits = getSubscriptionLimits(business.plan);
  const canAdd =
    limits.maxProducts === -1 || business._count.products < limits.maxProducts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            {business._count.products} de{" "}
            {limits.maxProducts === -1 ? "ilimitados" : limits.maxProducts}{" "}
            productos
          </p>
        </div>
        <ProductFormDialog canFeature={limits.canFeatureProducts} />
      </div>

      {!canAdd && (
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <CardContent className="pt-6">
            <p className="text-amber-900 text-sm dark:text-amber-100">
              Has alcanzado el límite de productos para tu plan.{" "}
              <Link
                href="/dashboard/subscription"
                className="font-medium underline"
              >
                Mejora tu plan
              </Link>{" "}
              para agregar más productos.
            </p>
          </CardContent>
        </Card>
      )}

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold text-lg">No tienes productos</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Comienza agregando tu primer producto
            </p>
            <div className="mt-4">
              <ProductFormDialog canFeature={limits.canFeatureProducts} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              canFeature={limits.canFeatureProducts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
