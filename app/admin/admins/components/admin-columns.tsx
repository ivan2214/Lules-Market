"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Suspense, useState } from "react";
import type { AdminDTO } from "@/app/data/admin/admin.dto";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminDeleteAlertDialog } from "./admin-delete-alert-dialog";

function AdminColumnsInner({ admins }: { admins: AdminDTO[] }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminDTO | null>(null);

  const onOpenChangeAdminFinishAlertDialog = (value: boolean) => {
    setDeleteDialogOpen(value);
  };

  const columns: ColumnDef<AdminDTO>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.user.name}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.user.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "permissions",
      header: "Permisos",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.permissions.includes("ALL") ? (
            <Badge>Todos los permisos</Badge>
          ) : (
            row.original.permissions.map((perm) => (
              <Badge key={perm} variant="outline">
                {perm.replace("_", " ")}
              </Badge>
            ))
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Creación",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("es-AR"),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedAdmin(row.original);
            setDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];
  return (
    <>
      <DataTable
        data={admins}
        columns={columns}
        searchPlaceholder="Buscar por negocio..."
      />

      <AdminDeleteAlertDialog
        onOpenChange={onOpenChangeAdminFinishAlertDialog}
        open={deleteDialogOpen}
        selectedAdmin={selectedAdmin}
      />
    </>
  );
}

export function AdminColumns({ admins }: { admins: AdminDTO[] }) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AdminColumnsInner admins={admins} />
    </Suspense>
  );
}
