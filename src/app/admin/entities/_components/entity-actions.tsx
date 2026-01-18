"use client";

import { Ban, CheckCircle, Eye, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { useEntityMutations } from "../../_hooks/use-admin-mutations";
import { type Entity, EntityDetailsModal } from "./entity-details-modal";

interface EntityActionsProps {
  type: "user" | "business";
  entity: Entity;
}

export function EntityActions({ type, entity }: EntityActionsProps) {
  const { banUser, activateUser, banBusiness, activateBusiness } =
    useEntityMutations();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const confirmBan = async () => {
    try {
      if (type === "user") {
        await banUser.mutateAsync(entity.id);
      } else {
        await banBusiness.mutateAsync(entity.id);
      }
      toast.success(type === "user" ? "Usuario baneado" : "Comercio baneado", {
        description: `${entity.name || "La entidad"} ha sido baneado.`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "No se pudo banear la entidad",
      });
    } finally {
      setIsAlertOpen(false);
    }
  };

  const handleActivate = async () => {
    try {
      if (type === "user") {
        await activateUser.mutateAsync(entity.id);
      } else {
        await activateBusiness.mutateAsync(entity.id);
      }
      toast.success(
        type === "user" ? "Usuario activado" : "Comercio activado",
        {
          description: `${entity.name || "La entidad"} ha sido activado.`,
        },
      );
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "No se pudo activar la entidad",
      });
    }
  };

  const isPending =
    banUser.isPending ||
    activateUser.isPending ||
    banBusiness.isPending ||
    activateBusiness.isPending;

  const isSuspended = "status" in entity && entity.status === "SUSPENDED";

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
          {isSuspended ? (
            <DropdownMenuItem onClick={handleActivate} disabled={isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Activar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setIsAlertOpen(true)}
              disabled={isPending}
              className="text-destructive"
            >
              <Ban className="mr-2 h-4 w-4" />
              Banear
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EntityDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        type={type}
        entity={entity}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de banear{" "}
              {type === "user" ? "a este usuario" : "este comercio"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {type === "user"
                ? "El usuario perderá acceso a la plataforma."
                : "El comercio y sus productos dejarán de ser visibles para los usuarios."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Banear {type === "user" ? "Usuario" : "Comercio"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
