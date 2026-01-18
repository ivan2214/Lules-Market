"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/db/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface ProductDetailsModalProps {
  product: Product & {
    business?: { name: string } | null;
    images?: { url: string }[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalles del Producto
          </DialogTitle>
          <DialogDescription>
            Información completa del producto {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-2">
          {/* Main Info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-muted-foreground text-sm">
                Nombre
              </h4>
              <p className="font-medium text-lg">{product.name}</p>
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground text-sm">
                Descripción
              </h4>
              <p className="text-sm">
                {product.description || "Sin descripción"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-muted-foreground text-sm">
                  Precio
                </h4>
                <p className="font-medium">
                  ${(product.price ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground text-sm">
                  Descuento
                </h4>
                <p className="font-medium text-green-600">
                  {product.discount}%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-muted-foreground text-sm">
                  Stock
                </h4>
                <p>
                  {product.stock === null ? (
                    <span className="text-muted-foreground">Ilimitado</span>
                  ) : (
                    product.stock
                  )}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-muted-foreground text-sm">
                  Estado
                </h4>
                <Badge variant={product.active ? "default" : "destructive"}>
                  {product.active ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground text-sm">
                Comercio
              </h4>
              <p>{product.business?.name || "N/A"}</p>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h4 className="font-semibold text-muted-foreground text-sm">
              Imágenes
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-md border"
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 flex aspect-video items-center justify-center rounded-md border bg-muted text-muted-foreground text-sm">
                  Sin imágenes
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
