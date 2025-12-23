"use client";

import { useMutation } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Facebook, Instagram, MessageCircle, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BusinessWithRelations } from "@/db/types";
import { orpcTanstack } from "@/lib/orpc";
import { DataTable } from "@/shared/components/table/data-table";
import { DataTableColumnHeader } from "@/shared/components/table/data-table-column-header";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { BusinessActions } from "./business-actions";

type BusinessesClientProps = {
  businesses: BusinessWithRelations[];
};

export const BusinessesClient: React.FC<BusinessesClientProps> = ({
  businesses,
}) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessWithRelations | null>(null);

  const handleViewDetails = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      setDetailsDialogOpen(true);
    }
  };

  const mutate = useMutation(
    orpcTanstack.admin.deleteBusinessByIds.mutationOptions({
      onSuccess: ({ success }) => {
        if (success) {
          toast.success("Negocio eliminado correctamente");
        } else {
          toast.error("Error al eliminar el negocio");
        }
      },
      onError: () => {
        toast.error("Error al eliminar el negocio");
      },
    }),
  );

  const columns: ColumnDef<BusinessWithRelations>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Negocio" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "user.name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Propietario" />
      ),
    },
    {
      accessorKey: "currentPlan.planType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Plan" />
      ),
      cell: ({ row }) => {
        const variant =
          row.original.currentPlan?.planType === "PREMIUM"
            ? "default"
            : row.original.currentPlan?.planType === "BASIC"
              ? "secondary"
              : "outline";
        return (
          <Badge variant={variant}>{row.original.currentPlan?.planType}</Badge>
        );
      },
    },
    {
      accessorKey: "products",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Productos" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.products?.length}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fecha de Creación" />
      ),
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("es-AR"),
    },
    {
      id: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Estado" />
      ),
      cell: ({ row }) => {
        if (row.original.bannedBusiness)
          return <Badge variant="destructive">Baneado</Badge>;
        if (!row.original.isActive)
          return <Badge variant="secondary">Inactivo</Badge>;
        return <Badge variant="outline">Activo</Badge>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <BusinessActions
          business={row.original}
          onViewDetails={handleViewDetails}
        />
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Negocios</CardTitle>
          <CardDescription>
            {businesses.length} Negocios Encontrados
          </CardDescription>
        </CardHeader>
        <CardContent className="mx-auto max-w-xs overflow-x-hidden lg:max-w-full">
          <DataTable
            data={businesses}
            columns={columns}
            searchPlaceholder="Buscar por nombre o propietario..."
            onRowAction={mutate}
          />
        </CardContent>
      </Card>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Negocio</DialogTitle>
            <DialogDescription>
              Información completa del negocio
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl">
                    {selectedBusiness.name}
                  </h3>
                </div>
                <Badge
                  variant={
                    selectedBusiness.currentPlan?.planType === "PREMIUM"
                      ? "default"
                      : selectedBusiness.currentPlan?.planType === "BASIC"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedBusiness.currentPlan?.planType}
                </Badge>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Propietario
                    </div>
                    <div className="font-medium">
                      {selectedBusiness.user?.name}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Productos
                    </div>
                    <div className="font-medium">
                      {selectedBusiness.products?.length}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Estado
                    </div>
                    <div className="mt-1">
                      {selectedBusiness.bannedBusiness ? (
                        <Badge variant="destructive">Baneado</Badge>
                      ) : selectedBusiness.isActive ? (
                        <Badge variant="outline">Activo</Badge>
                      ) : (
                        <Badge variant="secondary">Inactivo</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Fecha de Creación
                    </div>
                    <div>
                      {new Date(selectedBusiness.createdAt).toLocaleDateString(
                        "es-AR",
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 font-medium text-muted-foreground text-sm">
                    Redes Sociales
                  </div>
                  <div className="space-y-2">
                    {selectedBusiness.instagram && (
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedBusiness.instagram}</span>
                      </div>
                    )}
                    {selectedBusiness.facebook && (
                      <div className="flex items-center gap-2">
                        <Facebook className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedBusiness.facebook}</span>
                      </div>
                    )}
                    {selectedBusiness.whatsapp && (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedBusiness.whatsapp}</span>
                      </div>
                    )}
                    {!selectedBusiness.instagram &&
                      !selectedBusiness.facebook &&
                      !selectedBusiness.whatsapp && (
                        <div className="text-muted-foreground text-sm">
                          No hay redes sociales configuradas
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
