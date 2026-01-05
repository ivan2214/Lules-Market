import { MessageCircleWarningIcon, Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { ProductCardDashboard } from "@/features//dashboard/_components/product-card-dashboard";
import { ProductFormDialog } from "@/features//dashboard/_components/product-form-dialog";
import { subscriptionErrors } from "@/features//dashboard/_constants";
import { client } from "@/orpc";
import { getCurrentBusiness } from "@/orpc/actions/business/get-current-business";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Card, CardContent } from "@/shared/components/ui/card";

export async function ProductsContent() {
  const [error, result] = await getCurrentBusiness();

  if (error || !result.currentBusiness) {
    redirect(pathsConfig.auth.signUp);
  }
  const { currentBusiness } = result;
  const products = await client.products.private.listProductsByBusinessId();

  const currentPlan = currentBusiness.currentPlan;

  const canAdd =
    (currentPlan?.productsUsed || 0) < (currentPlan?.plan?.maxProducts || 0);
  const categories = await client.category.listAllCategories();

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
          categories={categories}
          maxImagesPerProduct={currentPlan?.imagesUsed || 0}
        />
      </div>

      {!canAdd && (
        <Alert variant="warning">
          <AlertTitle className="flex items-center">
            <MessageCircleWarningIcon className="mr-2 h-4 w-4" />
            Has alcanzado el límite de productos para tu plan
          </AlertTitle>
          <AlertDescription>
            <Link
              href={`/dashboard/subscription?error=${subscriptionErrors.subscription_limit_reached}`}
              className="font-medium underline"
            >
              Mejora tu plan para agregar más productos.
            </Link>
          </AlertDescription>
        </Alert>
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
                categories={categories}
                maxImagesPerProduct={currentPlan?.imagesUsed || 0}
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
              categories={categories}
              maxImagesPerProduct={currentPlan?.imagesUsed || 0}
            />
          ))}
        </div>
      )}
    </>
  );
}
