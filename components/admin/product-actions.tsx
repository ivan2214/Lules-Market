"use client";

import { Ban, CheckCircle, Eye, MoreHorizontal, Power } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductWithRelations } from "@/db";

interface ProductActionsProps {
  product: ProductWithRelations;
  onBan: (productId: string) => void;
  onUnban: (productId: string) => void;
  onToggleActive: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

export function ProductActions({
  product,
  onBan,
  onUnban,
  onToggleActive,
  onViewDetails,
}: ProductActionsProps) {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewDetails(product.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowToggleDialog(true)}>
            <Power className="mr-2 h-4 w-4" />
            {product.active ? "Desactivar" : "Activar"}
          </DropdownMenuItem>
          {product.bannedProduct ? (
            <DropdownMenuItem
              onClick={() => setShowUnbanDialog(true)}
              className="text-green-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Desbanear
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setShowBanDialog(true)}
              className="text-destructive"
            >
              <Ban className="mr-2 h-4 w-4" />
              Banear producto
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {product.active ? "¿Desactivar producto?" : "¿Activar producto?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {product.active
                ? `El producto "${product.name}" dejará de ser visible en la plataforma.`
                : `El producto "${product.name}" será visible nuevamente en la plataforma.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onToggleActive(product.id);
                setShowToggleDialog(false);
              }}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Banear producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de banear "{product.name}". El producto no será
              visible en la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onBan(product.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Banear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desbanear producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de desbanear "{product.name}". El producto será
              visible nuevamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onUnban(product.id)}>
              Desbanear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
