"use client";
import { useMutation } from "@tanstack/react-query";
import { PencilIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/eden";
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
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { TableCell } from "@/shared/components/ui/table";
import type { CategoryDto, ProductDto } from "@/shared/utils/dto";
import { ProductFormDialog } from "../../_components/product-form-dialog";

type ProductActionsProps = {
  item: ProductDto;
  categories: CategoryDto[];
  maxImagesPerProduct: number;
};

export const ProductActions = ({
  item,
  categories,
  maxImagesPerProduct,
}: ProductActionsProps) => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["delete-product", item.id],
    mutationFn: (productId: string) =>
      api.products.private.delete({}, { query: { productId } }),
    onSuccess() {
      toast.success("Producto eliminado");
    },
    onError(error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar el producto",
      );
    },
  });

  return (
    <TableCell className="flex items-center gap-1">
      <ProductFormDialog
        product={item}
        categories={categories}
        maxImagesPerProduct={maxImagesPerProduct}
        trigger={
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            type="button"
          >
            <PencilIcon className="mr-2 h-4 w-4" />
            Editar
          </Button>
        }
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isPending}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
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
              onClick={() => mutate(item.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TableCell>
  );
};
