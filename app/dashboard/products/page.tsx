import { Package } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentBusiness } from "@/app/data/business/require-busines";
import { ProductCard } from "@/components/dashboard/product-card";
import { ProductFormDialog } from "@/components/dashboard/product-form-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/lib/orpc";

async function ProductsContent() {
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
            <ProductCard
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

function ProductsSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-10 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i.toString()} className="h-64 w-full" />
        ))}
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
