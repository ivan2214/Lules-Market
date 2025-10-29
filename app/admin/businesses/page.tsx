"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Facebook, Instagram, MessageCircle, Store } from "lucide-react";
import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockBusinesses } from "@/lib/data/mock-data";
import type { Business, PlanType } from "@/types/admin";

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState(mockBusinesses);
  const [filter, setFilter] = useState<"all" | PlanType | "banned">("all");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );

  const handleBan = (businessId: string) => {
    setBusinesses(
      businesses.map((b) =>
        b.id === businessId ? { ...b, isBanned: true, isActive: false } : b,
      ),
    );
    console.log("Banear negocio:", businessId);
  };

  const handleUnban = (businessId: string) => {
    setBusinesses(
      businesses.map((b) =>
        b.id === businessId ? { ...b, isBanned: false, isActive: true } : b,
      ),
    );
    console.log("Desbanear negocio:", businessId);
  };

  const handleChangePlan = (businessId: string, plan: PlanType) => {
    setBusinesses(
      businesses.map((b) => (b.id === businessId ? { ...b, plan } : b)),
    );
    console.log("Cambiar plan:", businessId, plan);
  };

  const handleViewDetails = (businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      setDetailsDialogOpen(true);
    }
    console.log("Ver detalles del negocio:", businessId);
  };

  const filteredBusinesses = businesses.filter((business) => {
    if (filter === "all") return true;
    if (filter === "banned") return business.isBanned;
    return business.plan === filter;
  });

  const columns: ColumnDef<Business>[] = [
    {
      accessorKey: "name",
      header: "Negocio",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-muted-foreground text-sm">
            @{row.original.slug}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "ownerName",
      header: "Propietario",
    },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }) => {
        const variant =
          row.original.plan === "PREMIUM"
            ? "default"
            : row.original.plan === "BASIC"
              ? "secondary"
              : "outline";
        return <Badge variant={variant}>{row.original.plan}</Badge>;
      },
    },
    {
      accessorKey: "productsCount",
      header: "Productos",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.productsCount}</span>
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
        if (row.original.isBanned)
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
          onBan={handleBan}
          onUnban={handleUnban}
          onChangePlan={handleChangePlan}
          onViewDetails={handleViewDetails}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Gestión de Negocios
        </h1>
        <p className="text-muted-foreground">
          Administra todos los comercios de la plataforma
        </p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as typeof filter)}
      >
        <TabsList>
          <TabsTrigger value="all">Todos ({businesses.length})</TabsTrigger>
          <TabsTrigger value="FREE">
            FREE ({businesses.filter((b) => b.plan === "FREE").length})
          </TabsTrigger>
          <TabsTrigger value="BASIC">
            BASIC ({businesses.filter((b) => b.plan === "BASIC").length})
          </TabsTrigger>
          <TabsTrigger value="PREMIUM">
            PREMIUM ({businesses.filter((b) => b.plan === "PREMIUM").length})
          </TabsTrigger>
          <TabsTrigger value="banned">
            Baneados ({businesses.filter((b) => b.isBanned).length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value={filter} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Negocios</CardTitle>
              <CardDescription>
                {filteredBusinesses.length} negocio
                {filteredBusinesses.length !== 1 ? "s" : ""} encontrado
                {filteredBusinesses.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredBusinesses}
                columns={columns}
                searchPlaceholder="Buscar por nombre o propietario..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                  <p className="text-muted-foreground">
                    @{selectedBusiness.slug}
                  </p>
                </div>
                <Badge
                  variant={
                    selectedBusiness.plan === "PREMIUM"
                      ? "default"
                      : selectedBusiness.plan === "BASIC"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedBusiness.plan}
                </Badge>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Propietario
                    </div>
                    <div className="font-medium">
                      {selectedBusiness.ownerName}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Productos
                    </div>
                    <div className="font-medium">
                      {selectedBusiness.productsCount}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Estado
                    </div>
                    <div className="mt-1">
                      {selectedBusiness.isBanned ? (
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
    </div>
  );
}
