import { CheckCircle, Package, XCircle } from "lucide-react";
import { Suspense } from "react";
import {
  getAdminProducts,
  getAdminProductsStats,
} from "@/data/admin/products-admin";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ProductActions } from "./_components/product-actions";

export default function AdminProductsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Moderación de Productos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gestiona y modera los productos de todos los comercios.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <ProductStats />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lista de Productos
          </CardTitle>
          <CardDescription>
            Todos los productos registrados en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <ProductsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function ProductStats() {
  const stats = await getAdminProductsStats();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-sm">Total Productos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-sm">Activos</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.active}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-medium text-sm">Inactivos</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{stats.inactive}</div>
        </CardContent>
      </Card>
    </div>
  );
}

async function ProductsTable() {
  const { products, total } = await getAdminProducts({ page: 1, perPage: 50 });

  if (products.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No hay productos registrados.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Comercio</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.business?.name || "N/A"}</TableCell>
              <TableCell>
                ${(product.price ?? 0).toLocaleString()}
                {product.discount > 0 && (
                  <span className="ml-1 text-green-600 text-xs">
                    -{product.discount}%
                  </span>
                )}
              </TableCell>
              <TableCell>
                {product.stock === null ? (
                  <span className="text-muted-foreground">∞</span>
                ) : (
                  product.stock
                )}
              </TableCell>
              <TableCell>
                <Badge variant={product.active ? "default" : "destructive"}>
                  {product.active ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(product.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <ProductActions product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-4 text-muted-foreground text-sm">
        Mostrando {products.length} de {total} productos
      </p>
    </>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
