"use client";

import { Plus } from "lucide-react";
import { Permission } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
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

const availablePermissions = [
  Permission.ALL,
  Permission.BAN_USERS,
  Permission.MANAGE_COUPONS,
  Permission.MANAGE_PAYMENTS,
  Permission.MODERATE_CONTENT,
  Permission.VIEW_ANALYTIICS,
];

export const AdminCreateDialog = () => {
  return (
    <Dialog>
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
            <Input id="email" type="email" placeholder="usuario@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Permisos</Label>
            <div className="space-y-2">
              {availablePermissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox id={permission} />
                  <label
                    htmlFor={permission}
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {permission.toLocaleLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button>Agregar Admin</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
