import { Package } from "lucide-react";
import Link from "next/link";
import { ProductCardDashboard } from "@/features/(dashboard)/dashboard/_components/product-card-dashboard";
import { ProductFormDialog } from "@/features/(dashboard)/dashboard/_components/product-form-dialog";
import { orpc } from "@/lib/orpc";
import { getCurrentBusiness } from "@/shared/actions/business/get-current-business";
import { Card, CardContent } from "@/shared/components/ui/card";

export async function ProductsContent() {
  const { currentBusiness } = await getCurrentBusiness();
  const products = await orpc.products.listProductsByBusinessId();

  const currentPlan = currentBusiness.currentPlan;

  const canAdd =
    (currentPlan?.productsUsed || 0) < (currentPlan?.plan?.maxProducts || 0);
  const categories = await orpc.category.listAllCategories();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            {currentPlan?.productsUsed ?? 0} de {currentPlan?.plan?.maxProducts}
          </p>
        </div>
        <ProductFormDialog
          canFeature={currentPlan?.canFeatureProducts || false}
          categories={categories}
        />
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
              <ProductFormDialog
                canFeature={currentPlan?.canFeatureProducts || false}
                categories={categories}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCardDashboard
              key={product.id}
              product={product}
              canFeature={currentPlan?.canFeatureProducts || false}
              categories={categories}
            />
          ))}
        </div>
      )}
    </>
  );
}
