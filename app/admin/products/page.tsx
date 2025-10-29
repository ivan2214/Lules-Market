"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import { ProductActions } from "@/components/admin/product-actions";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts } from "@/lib/data/mock-data";
import type { Product } from "@/types/admin";

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "banned"
  >("all");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleBan = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isBanned: true, isActive: false } : p,
      ),
    );
    console.log("Banear producto:", productId);
  };

  const handleUnban = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isBanned: false, isActive: true } : p,
      ),
    );
    console.log("Desbanear producto:", productId);
  };

  const handleToggleActive = (productId: string) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isActive: !p.isActive } : p,
      ),
    );
    console.log("Toggle activo producto:", productId);
  };

  const handleViewDetails = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setDetailsDialogOpen(true);
    }
    console.log("Ver detalles del producto:", productId);
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (filter === "banned") return product.isBanned;
    if (filter === "active") return product.isActive && !product.isBanned;
    if (filter === "inactive") return !product.isActive && !product.isBanned;
    return true;
  });

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Producto",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.category}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "businessName",
      header: "Negocio",
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => (
        <span className="font-medium">
          ${(row.original.price / 100).toFixed(2)}
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
        if (row.original.isBanned)
          return <Badge variant="destructive">Baneado</Badge>;
        if (!row.original.isActive)
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
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Gestión de Productos
        </h1>
        <p className="text-muted-foreground">
          Administra todos los productos de la plataforma
        </p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as typeof filter)}
      >
        <TabsList>
          <TabsTrigger value="all">Todos ({products.length})</TabsTrigger>
          <TabsTrigger value="active">
            Activos ({products.filter((p) => p.isActive && !p.isBanned).length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactivos (
            {products.filter((p) => !p.isActive && !p.isBanned).length})
          </TabsTrigger>
          <TabsTrigger value="banned">
            Baneados ({products.filter((p) => p.isBanned).length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value={filter} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>
                {filteredProducts.length} producto
                {filteredProducts.length !== 1 ? "s" : ""} encontrado
                {filteredProducts.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredProducts}
                columns={columns}
                searchPlaceholder="Buscar por nombre o categoría..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
              {selectedProduct.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={selectedProduct.imageUrl || "/placeholder.svg"}
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
                      ${(selectedProduct.price / 100).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Categoría
                    </div>
                    <div>{selectedProduct.category}</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground text-sm">
                    Negocio
                  </div>
                  <div>{selectedProduct.businessName}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Estado
                    </div>
                    <div className="mt-1">
                      {selectedProduct.isBanned ? (
                        <Badge variant="destructive">Baneado</Badge>
                      ) : selectedProduct.isActive ? (
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
    </div>
  );
}
