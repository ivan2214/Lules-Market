"use client";

import { Edit, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteProductAction } from "@/app/actions/product.action";
import type { Image as ImagePrisma } from "@/app/generated/prisma";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImageWithSkeleton } from "../image-with-skeleton";
import { ProductFormDialog } from "./product-form-dialog";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    images: ImagePrisma[];
    category: string | null;
    featured: boolean;
    active: boolean;
  };
  canFeature: boolean;
}

export function ProductCard({ product, canFeature = false }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await deleteProductAction({
        productId: product.id,
      });
      if (result) {
        toast.success("Producto eliminado");
        router.refresh();
      } else {
        toast.error(result || "Error al eliminar el producto");
      }
    } catch (error) {
      console.error(" Error deleting product:", error);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
          {product.images[0] ? (
            <ImageWithSkeleton
              src={product.images[0].url || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-amber-500">
              <Star className="mr-1 h-3 w-3" />
              Destacado
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold">{product.name}</h3>
            {!product.active && <Badge variant="secondary">Inactivo</Badge>}
          </div>
          {product.description && (
            <p className="line-clamp-2 text-muted-foreground text-sm">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="font-bold text-lg">
              {product.price
                ? `$${product.price.toLocaleString()}`
                : "Sin precio"}
            </p>
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <ProductFormDialog
          canFeature={canFeature}
          product={{
            ...product,
            category: product.category || "Otros",
          }}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              type="button"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={loading}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El producto será eliminado
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
