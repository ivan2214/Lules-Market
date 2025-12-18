"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/app/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/shared/components/ui/dialog";
import { Input } from "@/app/shared/components/ui/input";
import { Label } from "@/app/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select";

export const TrialCreateFormDialog = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Trial
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nueva Prueba Gratuita</DialogTitle>
          <DialogDescription>
            Asigna una prueba gratuita a un negocio
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="business">Negocio</Label>
            <Input id="business" placeholder="Buscar negocio..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Select>
              <SelectTrigger id="plan">
                <SelectValue placeholder="Seleccionar plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BASIC">BASIC</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (días)</Label>
            <Input id="duration" type="number" placeholder="14" />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Crear Trial</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
