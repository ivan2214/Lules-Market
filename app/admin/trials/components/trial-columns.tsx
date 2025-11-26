"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, XCircle } from "lucide-react";
import { Suspense, useState } from "react";
import type { TrialDTO } from "@/app/data/trial/trial.dto";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrialExtendDialog } from "./trial-extend-dialog";
import { TrialFinishAlertDialog } from "./trial-finish-alert-dialog";

function TrialColumnsInner({ trials }: { trials: TrialDTO[] }) {
  const [selectedTrial, setSelectedTrial] = useState<TrialDTO | null>(null);

  const [trialExtendDialog, setTrialExtendDialog] = useState<boolean>(false);
  const [trialFinishAlertDialog, setTrialFinishAlertDialog] =
    useState<boolean>(false);

  const onOpenChangeTrialExtendDialog = (value: boolean) => {
    setTrialExtendDialog(value);
  };

  const onOpenChangeTrialFinishAlertDialog = (value: boolean) => {
    setTrialFinishAlertDialog(value);
  };

  const getDaysRemaining = (expiresAt: Date) => {
    const now = new Date();
    const end = new Date(expiresAt);
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diff;
  };

  const columns: ColumnDef<TrialDTO>[] = [
    {
      accessorKey: "businessName",
      header: "Negocio",
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => <Badge variant="outline">{row.original.plan}</Badge>,
    },
    {
      accessorKey: "startDate",
      header: "Fecha de Inicio",
      cell: ({ row }) =>
        new Date(row.original.activatedAt).toLocaleDateString("es-AR"),
    },
    {
      accessorKey: "expiresAt",
      header: "Fecha de Fin",
      cell: ({ row }) => {
        const daysRemaining = getDaysRemaining(row.original.expiresAt);
        return (
          <div>
            <div>
              {new Date(row.original.expiresAt).toLocaleDateString("es-AR")}
            </div>
            {row.original.isActive && (
              <div
                className={`text-xs ${
                  daysRemaining < 3
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {daysRemaining > 0
                  ? `${daysRemaining} días restantes`
                  : "Expirado"}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "outline" : "secondary"}>
          {row.original.isActive ? "Activo" : "Finalizado"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isActive && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChangeTrialExtendDialog(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Extender
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenChangeTrialFinishAlertDialog(true);
                  setSelectedTrial(row.original);
                }}
              >
                <XCircle className="mr-2 h-4 w-4 text-destructive" />
                Finalizar
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={trials}
        columns={columns}
        searchPlaceholder="Buscar por negocio..."
      />
      <TrialExtendDialog
        onOpenChange={onOpenChangeTrialExtendDialog}
        open={trialExtendDialog}
      />
      <TrialFinishAlertDialog
        onOpenChange={onOpenChangeTrialFinishAlertDialog}
        open={trialFinishAlertDialog}
        selectedTrial={selectedTrial}
      />
    </>
  );
}

export function TrialColumns({ trials }: { trials: TrialDTO[] }) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TrialColumnsInner trials={trials} />
    </Suspense>
  );
}
