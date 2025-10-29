"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockAdmins } from "@/lib/data/mock-data";
import type { Admin } from "@/types/admin";

const availablePermissions = [
  { id: "all", label: "Todos los permisos" },
  { id: "moderate_content", label: "Moderar contenido" },
  { id: "ban_users", label: "Banear usuarios" },
  { id: "manage_payments", label: "Gestionar pagos" },
  { id: "manage_coupons", label: "Gestionar cupones" },
  { id: "view_analytics", label: "Ver analytics" },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState(mockAdmins);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const handleDelete = (adminId: string) => {
    setAdmins(admins.filter((a) => a.id !== adminId));
    setDeleteDialogOpen(false);
    console.log("Eliminar admin:", adminId);
  };

  const handleCreate = () => {
    console.log("Crear nuevo admin");
    setIsCreateDialogOpen(false);
  };

  const columns = [
    {
      key: "name",
      label: "Nombre",
      render: (admin: Admin) => (
        <div>
          <div className="font-medium">{admin.name}</div>
          <div className="text-muted-foreground text-sm">{admin.email}</div>
        </div>
      ),
    },
    {
      key: "permissions",
      label: "Permisos",
      render: (admin: Admin) => (
        <div className="flex flex-wrap gap-1">
          {admin.permissions.includes("all") ? (
            <Badge>Todos los permisos</Badge>
          ) : (
            admin.permissions.map((perm) => (
              <Badge key={perm} variant="outline">
                {perm.replace("_", " ")}
              </Badge>
            ))
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Fecha de Creación",
      render: (admin: Admin) =>
        new Date(admin.createdAt).toLocaleDateString("es-AR"),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (admin: Admin) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedAdmin(admin);
            setDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">
            Gestión de Administradores
          </h1>
          <p className="text-muted-foreground">
            Administra los permisos de los administradores del sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Administrador</DialogTitle>
              <DialogDescription>
                Asigna permisos de administrador a un usuario
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email del Usuario</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Permisos</Label>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox id={permission.id} />
                      <label
                        htmlFor={permission.id}
                        className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate}>Agregar Admin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{admins.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Con Permisos Completos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {admins.filter((a) => a.permissions.includes("all")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Administradores</CardTitle>
          <CardDescription>
            {admins.length} administradores registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={admins}
            columns={columns}
            searchPlaceholder="Buscar por nombre o email..."
          />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Remover permisos de administrador?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de remover los permisos de administrador de "
              {selectedAdmin?.name}". El usuario perderá acceso al panel de
              administración.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedAdmin && handleDelete(selectedAdmin.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
