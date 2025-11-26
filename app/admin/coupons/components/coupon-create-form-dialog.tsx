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

export const CouponCreateFormDialog = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = () => {
    setIsCreateDialogOpen(false);
  };
  return (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Cupón
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cupón</DialogTitle>
          <DialogDescription>
            Define los parámetros del cupón de descuento
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input id="code" placeholder="SUMMER2024" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Select>
              <SelectTrigger id="plan">
                <SelectValue placeholder="Seleccionar plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="BASIC">BASIC</SelectItem>
                <SelectItem value="PREMIUM">PREMIUM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (meses)</Label>
            <Input id="duration" type="number" placeholder="3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxUses">Usos Máximos</Label>
            <Input id="maxUses" type="number" placeholder="100" />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Crear Cupón</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
