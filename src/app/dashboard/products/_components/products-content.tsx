import { MessageCircleWarningIcon, Package } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";

import pathsConfig from "@/config/paths.config";
import { getBusinessProducts } from "@/data/business/get";
import { getCurrentBusiness } from "@/data/business/get-current-business";
import { ProductCardDashboard } from "@/features/dashboard/_components/product-card-dashboard";
import { subscriptionErrors } from "@/features/dashboard/_constants";
import { api } from "@/lib/eden";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const ProductFormDialog = dynamic(
  () =>
    import("@/features/dashboard/_components/product-form-dialog").then(
      (mod) => mod.ProductFormDialog,
    ),
  {
    loading: () => <Button disabled>Cargando...</Button>,
  },
);

export async function ProductsContent() {
  const { currentBusiness, headers } = await getCurrentBusiness();

  if (!currentBusiness) {
    redirect(pathsConfig.business.setup);
  }

  const [products, categoriesResponse] = await Promise.all([
    getBusinessProducts(headers),
    api.category.public["list-all"].get(),
  ]);

  const categories = categoriesResponse.data ?? [];

  const plan = currentBusiness.currentPlan;
  const usedProducts = plan?.productsUsed ?? 0;
  const maxProducts = plan?.plan?.maxProducts ?? 0;

  const isUnlimited = maxProducts === 9999;
  const canAddProducts = isUnlimited || usedProducts < maxProducts;

  const productDialog = (
    <ProductFormDialog
      categories={categories}
      maxImagesPerProduct={plan?.imagesUsed ?? 0}
      disabled={!canAddProducts}
    />
  );

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Productos</h1>
          <p className="text-muted-foreground">
            {isUnlimited
              ? "Productos ilimitados"
              : `${usedProducts} de ${maxProducts} productos`}
          </p>
        </div>

        {productDialog}
      </header>

      {!canAddProducts && (
        <Alert variant="warning">
          <AlertTitle className="flex items-center gap-2">
            <MessageCircleWarningIcon className="h-4 w-4" />
            Límite de productos alcanzado
          </AlertTitle>
          <AlertDescription>
            <Link
              href={`/dashboard/subscription?error=${subscriptionErrors.subscription_limit_reached}`}
              className="font-medium underline"
            >
              Mejora tu plan para agregar más productos
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-semibold text-lg">
              No tienes productos aún
            </h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Comienza agregando tu primer producto
            </p>

            <div className="mt-4">{productDialog}</div>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCardDashboard
              key={product.id}
              product={product}
              categories={categories}
              maxImagesPerProduct={plan?.imagesUsed ?? 0}
            />
          ))}
        </section>
      )}
    </>
  );
}
