"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Facebook, Instagram, MessageCircle, Store } from "lucide-react";
import { useState } from "react";
import type { BusinessDTO } from "@/app/data/business/business.dto";
import { BusinessActions } from "@/components/admin/business-actions";
import { DataTable } from "@/components/table/data-table";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dialog";

type BusinessesClientProps = {
  businesses: BusinessDTO[];
};

export const BusinessesClient: React.FC<BusinessesClientProps> = ({
  businesses,
}) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessDTO | null>(
    null,
  );

  const handleViewDetails = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      setDetailsDialogOpen(true);
    }
  };

  const columns: ColumnDef<BusinessDTO>[] = [
    {
      accessorKey: "name",
      header: "Negocio",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email del negocio",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "user.name",
      header: "Propietario",
    },
    {
      accessorKey: "plan",
      header: "Plan",
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
      accessorKey: "productsCount",
      header: "Productos",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.products?.length}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Creación",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("es-AR"),
    },
    {
      id: "status",
      header: "Estado",
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
        <CardContent>
          <DataTable
            data={businesses}
            columns={columns}
            searchPlaceholder="Buscar por nombre o propietario..."
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
