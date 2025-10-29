"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Mail, Shield, Store } from "lucide-react";
import { useState } from "react";
import type { UserDTO } from "@/app/data/user/user.dto";
import { UserActions } from "@/components/admin/user-actions";
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

type UsersClientProps = {
  users: UserDTO[];
};

export const UsersClient: React.FC<UsersClientProps> = ({ users }) => {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  const handleBan = (userId: string) => {
    console.log("Banear usuario:", userId);
  };

  const handleUnban = (userId: string) => {
    console.log("Desbanear usuario:", userId);
  };

  const handleViewDetails = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setDetailsDialogOpen(true);
    }
    console.log("Ver detalles del usuario:", userId);
  };

  const columns: ColumnDef<UserDTO>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-muted-foreground text-sm">
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => (
        <Badge
          variant={row.original.userRole === "ADMIN" ? "default" : "secondary"}
        >
          {row.original.userRole}
        </Badge>
      ),
    },
    {
      accessorKey: "business",
      header: "Comerciante",
      cell: ({ row }) =>
        row.original.business ? (
          <Badge>Sí</Badge>
        ) : (
          <span className="text-muted-foreground">No</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Fecha de Registro",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("es-AR"),
    },
    {
      accessorKey: "isBanned",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.bannedUser ? "destructive" : "outline"}>
          {row.original.bannedUser ? "Baneado" : "Activo"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <UserActions
          user={row.original}
          onBan={handleBan}
          onUnban={handleUnban}
          onViewDetails={handleViewDetails}
        />
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>{users.length} Usuarios encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
            columns={columns}
            searchPlaceholder="Buscar por nombre o email..."
          />
        </CardContent>
      </Card>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
            <DialogDescription>
              Información completa del usuario
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="font-bold text-2xl text-primary">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    selectedUser.userRole === "ADMIN" ? "default" : "secondary"
                  }
                >
                  {selectedUser.userRole}
                </Badge>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Estado
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant={
                          selectedUser.bannedUser ? "destructive" : "outline"
                        }
                      >
                        {selectedUser.bannedUser ? "Baneado" : "Activo"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground text-sm">
                      Fecha de Registro
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(selectedUser.createdAt).toLocaleDateString(
                          "es-AR",
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    {selectedUser.business ? (
                      <>
                        <Store className="h-5 w-5 text-primary" />
                        <span className="font-medium">Es Comerciante</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Usuario Regular</span>
                      </>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {selectedUser.business
                      ? "Este usuario tiene uno o más negocios registrados en la plataforma."
                      : "Este usuario no tiene negocios registrados."}
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <div className="mb-1 font-medium text-sm">ID de Usuario</div>
                  <div className="font-mono text-muted-foreground text-xs">
                    {selectedUser.id}
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
