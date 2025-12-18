"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Power } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Plan } from "@/db/types";
import { PlanForm } from "./plan-form";

type PlanClientProps = {
  plans: Plan[];
};

export const PlanClient: React.FC<PlanClientProps> = ({ plans }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [toggleAlertOpen, setToggleAlertOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleToggleActive = (_planId: string) => {
    setToggleAlertOpen(false);
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const columns: ColumnDef<Plan>[] = [
    {
      accessorKey: "name",
      header: "Plan",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <Badge variant="outline" className="mt-1">
            {row.original.type}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Precio",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.price === 0
            ? "Gratis"
            : `$${(row.original.price / 100).toFixed(2)}`}
        </span>
      ),
    },
    {
      id: "limits",
      header: "Límites",
      cell: ({ row }) => (
        <div className="text-sm">
          <div>
            Productos:{" "}
            {row.original.maxProducts === -1
              ? "Ilimitados"
              : row.original.maxProducts}
          </div>
          <div className="text-muted-foreground">
            Imágenes:{" "}
            {row.original.maxImages === -1
              ? "Ilimitadas"
              : row.original.maxImages}
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "outline" : "secondary"}>
          {row.original.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedPlan(row.original);
              setToggleAlertOpen(true);
            }}
          >
            <Power className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Planes</CardTitle>
          <CardDescription>{plans.length} planes configurados</CardDescription>
        </CardHeader>
        <CardContent className="mx-auto max-w-xs overflow-x-hidden lg:max-w-full">
          <DataTable
            data={plans}
            columns={columns}
            searchPlaceholder="Buscar por nombre..."
          />
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Editar Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[calc(100vh-10rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Plan</DialogTitle>
            <DialogDescription>
              Define los parámetros del nuevo plan de suscripción
            </DialogDescription>
          </DialogHeader>
          <PlanForm selectedPlan={selectedPlan} />
        </DialogContent>
      </Dialog>
      <AlertDialog open={toggleAlertOpen} onOpenChange={setToggleAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPlan?.isActive ? "¿Desactivar plan?" : "¿Activar plan?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPlan?.isActive
                ? `El plan "${selectedPlan?.name}" dejará de estar disponible para nuevas suscripciones.`
                : `El plan "${selectedPlan?.name}" estará disponible para nuevas suscripciones.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedPlan && handleToggleActive(selectedPlan.type)
              }
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
