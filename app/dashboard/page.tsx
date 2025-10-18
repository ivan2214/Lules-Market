import { CreditCard, Eye, Package, TrendingUp } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductFormDialog } from "@/components/dashboard/product-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBusiness } from "@/lib/actions/business-actions";
import { getSubscriptionLimits } from "@/lib/subscription-limits";

export default async function DashboardPage() {
  const business = await getBusiness();

  if (!business) {
    redirect("/dashboard/setup");
  }

  const limits = getSubscriptionLimits(business.plan);
  const productCount = business._count.products;
  const productLimit =
    limits.maxProducts === -1 ? "Ilimitado" : limits.maxProducts;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de administración
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{productCount}</div>
            <p className="text-muted-foreground text-xs">
              de {productLimit} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Plan Actual</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{business.plan}</div>
            <p className="text-muted-foreground text-xs">
              {business.planStatus === "ACTIVE" ? "Activo" : "Inactivo"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Visitas</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">-</div>
            <p className="text-muted-foreground text-xs">
              {limits.hasStatistics ? "Disponible" : "Mejora tu plan"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Conversiones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">-</div>
            <p className="text-muted-foreground text-xs">
              {limits.hasStatistics ? "Disponible" : "Mejora tu plan"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ProductFormDialog
              canFeature={limits.canFeatureProducts}
              className="w-full"
            />

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/business">Editar Negocio</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/subscription">Ver Planes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium text-sm">Nombre</p>
              <p className="text-muted-foreground text-sm">{business.name}</p>
            </div>
            {business.description && (
              <div>
                <p className="font-medium text-sm">Descripción</p>
                <p className="line-clamp-2 text-muted-foreground text-sm">
                  {business.description}
                </p>
              </div>
            )}
            {business.phone && (
              <div>
                <p className="font-medium text-sm">Teléfono</p>
                <p className="text-muted-foreground text-sm">
                  {business.phone}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {business.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {business.products.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {product.price
                        ? `$${product.price.toLocaleString()}`
                        : "Sin precio"}
                    </p>
                  </div>
                  <ProductFormDialog
                    canFeature={limits.canFeatureProducts}
                    product={{
                      ...product,
                      category: product.category || "Otros",
                    }}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    }
                    isViewMode={true}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
