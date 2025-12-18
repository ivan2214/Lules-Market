"use client";

import { useMutation } from "@tanstack/react-query";
import { Edit, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { ImageWithSkeleton } from "@/app/shared/components/image-with-skeleton";
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
} from "@/app/shared/components/ui/alert-dialog";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import { Card, CardContent, CardFooter } from "@/app/shared/components/ui/card";
import type { CategoryWithRelations, ProductWithRelations } from "@/db/types";
import { orpcTanstack } from "@/lib/orpc";
import { mainImage } from "@/utils/main-image";
import { ProductFormDialog } from "./product-form-dialog";

interface ProductCardProps {
  product: ProductWithRelations;
  canFeature: boolean;
  categories: CategoryWithRelations[];
}

export function ProductCard({
  product,
  canFeature = false,
  categories,
}: ProductCardProps) {
  const router = useRouter();

  const { mutate, isPending } = useMutation(
    orpcTanstack.products.deleteProduct.mutationOptions({
      onSuccess() {
        toast.success("Producto eliminado");
        router.refresh();
      },
      onError(error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Error al eliminar el producto",
        );
      },
    }),
  );

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
          {product.images?.[0] ? (
            <ImageWithSkeleton
              src={mainImage(product.images) || "/placeholder.svg"}
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
                {product.category.value}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <ProductFormDialog
          canFeature={canFeature}
          product={product}
          categories={categories}
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
            <Button variant="outline" size="sm" disabled={isPending}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Â¿Eliminar producto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acciÃ³n no se puede deshacer. El producto serÃ¡ eliminado
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => mutate({ productId: product.id })}
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
