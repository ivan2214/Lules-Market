"use client";
import type { ColumnDef } from "@tanstack/react-table";

import { Calendar, Mail, Shield, Store } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { UserActions } from "@/components/admin/user-actions";
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
import { mockUsers } from "@/lib/data/mock-data";
import type { User, UserRole } from "@/types/admin";

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState<"all" | UserRole | "banned">("all");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleBan = (userId: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isBanned: true } : u)),
    );
    console.log("Banear usuario:", userId);
  };

  const handleUnban = (userId: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isBanned: false } : u)),
    );
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

  const filteredUsers: User[] = users.filter((user) => {
    if (filter === "all") return true;
    if (filter === "banned") return user.isBanned;
    return user.role === filter;
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: (user: User) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-muted-foreground text-sm">{user.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: (user: User) => (
        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: "isBusinessOwner",
      label: "Comerciante",
      render: (user: User) =>
        user.isBusinessOwner ? (
          <Badge>Sí</Badge>
        ) : (
          <span className="text-muted-foreground">No</span>
        ),
    },
    {
      key: "createdAt",
      label: "Fecha de Registro",
      render: (user: User) =>
        new Date(user.createdAt).toLocaleDateString("es-AR"),
    },
    {
      key: "status",
      label: "Estado",
      render: (user: User) => (
        <Badge variant={user.isBanned ? "destructive" : "outline"}>
          {user.isBanned ? "Baneado" : "Activo"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (user: User) => (
        <UserActions
          user={user}
          onBan={handleBan}
          onUnban={handleUnban}
          onViewDetails={handleViewDetails}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Gestión de Usuarios
        </h1>
        <p className="text-muted-foreground">
          Administra todos los usuarios de la plataforma
        </p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as typeof filter)}
      >
        <TabsList>
          <TabsTrigger value="all">Todos ({users.length})</TabsTrigger>
          <TabsTrigger value="USER">
            Usuarios ({users.filter((u) => u.role === "USER").length})
          </TabsTrigger>
          <TabsTrigger value="BUSINESS">
            Comerciantes ({users.filter((u) => u.role === "BUSINESS").length})
          </TabsTrigger>
          <TabsTrigger value="ADMIN">
            Admins ({users.filter((u) => u.role === "ADMIN").length})
          </TabsTrigger>
          <TabsTrigger value="banned">
            Baneados ({users.filter((u) => u.isBanned).length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value={filter} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>
                {filteredUsers.length} usuario
                {filteredUsers.length !== 1 ? "s" : ""} encontrado
                {filteredUsers.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredUsers}
                columns={columns}
                searchPlaceholder="Buscar por nombre o email..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                    selectedUser.role === "ADMIN" ? "default" : "secondary"
                  }
                >
                  {selectedUser.role}
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
                          selectedUser.isBanned ? "destructive" : "outline"
                        }
                      >
                        {selectedUser.isBanned ? "Baneado" : "Activo"}
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
                    {selectedUser.isBusinessOwner ? (
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
                    {selectedUser.isBusinessOwner
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
    </div>
  );
}
