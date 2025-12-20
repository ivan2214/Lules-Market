import { CreditCard, Eye, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

import { orpc } from "@/lib/orpc";
import { getCurrentBusiness } from "@/shared/actions/business/get-current-business";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ProductFormDialog } from "./_components/product-form-dialog";

// ✅ Componente separado para contenido con auth
async function DashboardContent() {
  const { currentBusiness } = await getCurrentBusiness();

  const productsBusiness = await orpc.business.myProducts({
    limit: 5,
    offset: 0,
  });

  const productCount = currentBusiness.products?.length || 0;
  const productLimit = currentBusiness.currentPlan?.plan?.maxProducts || 0;
  const categories = await orpc.category.listAllCategories();

  return (
    <>
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
            <div className="font-bold text-2xl">
              {currentBusiness.currentPlan?.planType}
            </div>
            <p className="text-muted-foreground text-xs">
              {currentBusiness.currentPlan?.planStatus === "ACTIVE"
                ? "Activo"
                : "Inactivo"}
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
              {currentBusiness.currentPlan?.hasStatistics
                ? "Disponible"
                : "Mejora tu plan"}
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
              {currentBusiness.currentPlan?.hasStatistics
                ? "Disponible"
                : "Mejora tu plan"}
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
              canFeature={
                currentBusiness.currentPlan?.canFeatureProducts || false
              }
              className="w-full"
              categories={categories}
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
              <p className="text-muted-foreground text-sm">
                {currentBusiness.name}
              </p>
            </div>
            {currentBusiness.description && (
              <div>
                <p className="font-medium text-sm">Descripción</p>
                <p className="line-clamp-2 text-muted-foreground text-sm">
                  {currentBusiness.description}
                </p>
              </div>
            )}
            {currentBusiness.phone && (
              <div>
                <p className="font-medium text-sm">Teléfono</p>
                <p className="text-muted-foreground text-sm">
                  {currentBusiness.phone}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {productsBusiness.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productsBusiness.slice(0, 5).map((product) => (
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
                    canFeature={
                      currentBusiness.currentPlan?.canFeatureProducts || false
                    }
                    product={product}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    }
                    isViewMode={true}
                    categories={categories}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de administración
        </p>
      </div>

      <DashboardContent />
    </div>
  );
}
