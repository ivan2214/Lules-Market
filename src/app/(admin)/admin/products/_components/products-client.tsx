"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import type { ProductWithRelations } from "@/db/types";
import { DataTable } from "@/shared/components/table/data-table";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { mainImage } from "@/shared/utils/main-image";
import { ProductActions } from "./product-actions";

type ProductsClientProps = {
  products: ProductWithRelations[];
};

export const ProductsClient: React.FC<ProductsClientProps> = ({ products }) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);

  const handleBan = (_productId: string) => {};

  const handleUnban = (_productId: string) => {};

  const handleToggleActive = (_productId: string) => {};

  const handleViewDetails = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setDetailsDialogOpen(true);
    }
  };

  const columns: ColumnDef<ProductWithRelations>[] = [
    {
      accessorKey: "name",
      header: "Producto",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.category?.label || "Sin categoría"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "business.name",
      header: "Negocio",
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => (
        <span className="font-medium">
          ${((row.original.price || 0) / 100).toFixed(2)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Creación",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("es-AR"),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => {
        if (row.original.bannedProduct)
          return <Badge variant="destructive">Baneado</Badge>;
        if (!row.original.active)
          return <Badge variant="secondary">Inactivo</Badge>;
        return <Badge variant="outline">Activo</Badge>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <ProductActions
          product={row.original}
          onBan={handleBan}
          onUnban={handleUnban}
          onToggleActive={handleToggleActive}
          onViewDetails={handleViewDetails}
        />
      ),
    },
  ];
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
          <CardDescription>
            {products.length} Productos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-auto max-w-xs overflow-x-hidden lg:max-w-full">
          <DataTable
            data={products}
            columns={columns}
            searchPlaceholder="Buscar por nombre o categoría..."
          />
        </CardContent>
      </Card>
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
            <DialogDescription>
              Información completa del producto
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {selectedProduct.images?.length && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={
                      mainImage(selectedProduct.images) || "/placeholder.svg"
                    }
                    alt={selectedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="grid gap-4">
                <div>
                  <div className="font-medium text-muted-foreground text-sm">
                    Nombre
                  </div>
                  <div className="font-semibold text-lg">
                    {selectedProduct.name}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground text-sm">
                    Descripción
                  </div>
                  <div>{selectedProduct.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Precio
                    </div>
                    <div className="font-semibold text-lg">
                      ${((selectedProduct.price ?? 0) / 100).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Categoría
                    </div>
                    <div>
                      {selectedProduct.category?.label || "Sin categoría"}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground text-sm">
                    Negocio
                  </div>
                  <div>{selectedProduct.business?.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Estado
                    </div>
                    <div className="mt-1">
                      {selectedProduct.bannedProduct ? (
                        <Badge variant="destructive">Baneado</Badge>
                      ) : selectedProduct.active ? (
                        <Badge variant="outline">Activo</Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Fecha de Creación
                    </div>
                    <div>
                      {new Date(selectedProduct.createdAt).toLocaleDateString(
                        "es-AR",
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
