"use client";

import { MoreHorizontal, Pause, Pencil, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Plan } from "@/db/types";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { usePlanMutations } from "../../_hooks/use-admin-mutations";

interface PlansTableActionsProps {
  plan: Plan;
}

export function PlansTableActions({ plan }: PlansTableActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editPrice, setEditPrice] = useState(plan.price.toString());
  const [editMaxProducts, setEditMaxProducts] = useState(
    plan.maxProducts.toString(),
  );
  const [editMaxImages, setEditMaxImages] = useState(
    plan.maxImagesPerProduct.toString(),
  );

  const { updatePlan, pausePlan, reactivatePlan } = usePlanMutations();

  const handlePause = async () => {
    if (plan.type === "FREE") {
      toast.error("No permitido", {
        description: "No se puede pausar el plan FREE",
      });
      return;
    }

    try {
      await pausePlan.mutateAsync(plan.type);
      toast("Plan pausado", {
        description: `El plan ${plan.name} ha sido pausado.`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      } else {
        toast.error("Error", {
          description: "No se pudo pausar el plan",
        });
      }
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivatePlan.mutateAsync(plan.type);
      toast.success("Plan reactivado", {
        description: `El plan ${plan.name} ha sido reactivado.`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      } else {
        toast.error("Error", {
          description: "No se pudo reactivar el plan",
        });
      }
    }
  };

  const handleEdit = async () => {
    try {
      await updatePlan.mutateAsync({
        type: plan.type,
        data: {
          price: parseFloat(editPrice),
          maxProducts: parseInt(editMaxProducts, 10),
        },
      });
      toast.success("Plan actualizado", {
        description: `El plan ${plan.name} ha sido actualizado.`,
      });
      setEditOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      } else {
        toast.error("Error", {
          description: "No se pudo actualizar el plan",
        });
      }
    }
  };

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
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          {plan.isActive ? (
            <DropdownMenuItem
              onClick={handlePause}
              disabled={plan.type === "FREE" || pausePlan.isPending}
            >
              <Pause className="mr-2 h-4 w-4" />
              Pausar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleReactivate}
              disabled={reactivatePlan.isPending}
            >
              <Play className="mr-2 h-4 w-4" />
              Reactivar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Plan {plan.name}</DialogTitle>
            <DialogDescription>
              Modifica los parámetros del plan. Los cambios se aplicarán
              inmediatamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio
              </Label>
              <Input
                id="price"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxProducts" className="text-right">
                Max Productos
              </Label>
              <Input
                id="maxProducts"
                type="number"
                value={editMaxProducts}
                onChange={(e) => setEditMaxProducts(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxImages" className="text-right">
                Max Imágenes
              </Label>
              <Input
                id="maxImages"
                type="number"
                value={editMaxImages}
                onChange={(e) => setEditMaxImages(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={updatePlan.isPending}>
              {updatePlan.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
