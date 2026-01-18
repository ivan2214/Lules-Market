"use client";

import {
  Ban,
  CheckCircle,
  Eye,
  MoreHorizontal,
  PauseCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/db/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useProductMutations } from "../../_hooks/use-admin-mutations";
import { ProductDetailsModal } from "./product-details-modal";

interface ProductActionsProps {
  product: Product & {
    business?: { name: string } | null;
    images?: { url: string }[];
  };
}

export function ProductActions({ product }: ProductActionsProps) {
  const { banProduct, pauseProduct, activateProduct } = useProductMutations();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"BAN" | "PAUSE" | null>(null);

  const handleActionClick = (type: "BAN" | "PAUSE") => {
    setAlertType(type);
    setIsAlertOpen(true);
  };

  const confirmAction = async () => {
    try {
      if (alertType === "BAN") {
        await banProduct.mutateAsync(product.id);
        toast.success("Producto baneado", {
          description: `El producto "${product.name}" ha sido baneado.`,
        });
      } else if (alertType === "PAUSE") {
        await pauseProduct.mutateAsync(product.id);
        toast.success("Producto pausado", {
          description: `El producto "${product.name}" ha sido pausado.`,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: `No se pudo ${
          alertType === "BAN" ? "banear" : "pausar"
        } el producto`,
      });
    } finally {
      setIsAlertOpen(false);
      setAlertType(null);
    }
  };

  const handleActivate = async () => {
    try {
      await activateProduct.mutateAsync(product.id);
      toast.success("Producto activado", {
        description: `El producto "${product.name}" ha sido activado.`,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "No se pudo activar el producto",
      });
    }
  };

  const isPending =
    banProduct.isPending || pauseProduct.isPending || activateProduct.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          {product.active ? (
            <>
              <DropdownMenuItem
                onClick={() => handleActionClick("PAUSE")}
                disabled={isPending}
              >
                <PauseCircle className="mr-2 h-4 w-4" />
                Pausar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleActionClick("BAN")}
                disabled={isPending}
                className="text-destructive"
              >
                <Ban className="mr-2 h-4 w-4" />
                Banear
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={handleActivate} disabled={isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Activar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductDetailsModal
        product={product}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertType === "BAN"
                ? "¿Estás seguro de banear este producto?"
                : "¿Estás seguro de pausar este producto?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertType === "BAN"
                ? "El producto dejará de ser visible para todos los usuarios y no podrá ser comprado."
                : "El producto se ocultará temporalmente del catálogo."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={
                alertType === "BAN"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {alertType === "BAN" ? "Banear Producto" : "Pausar Producto"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
