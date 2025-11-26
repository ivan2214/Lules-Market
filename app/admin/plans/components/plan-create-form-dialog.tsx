"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const PlanCreateFormDialog = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Plan</DialogTitle>
          <DialogDescription>
            Define los parámetros del nuevo plan de suscripción
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Plan</Label>
              <Input id="name" placeholder="Plan Básico" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">FREE</SelectItem>
                  <SelectItem value="BASIC">BASIC</SelectItem>
                  <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" placeholder="Descripción del plan..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (centavos)</Label>
              <Input id="price" type="number" placeholder="14999" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxProducts">Máx. Productos</Label>
              <Input id="maxProducts" type="number" placeholder="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxImages">Máx. Imágenes</Label>
              <Input id="maxImages" type="number" placeholder="10" />
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
          <Button onClick={handleCreate}>Crear Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
