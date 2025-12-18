"use client";

import { useState } from "react";

import { Button } from "@/app/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/shared/components/ui/dialog";
import { Input } from "@/app/shared/components/ui/input";
import { Label } from "@/app/shared/components/ui/label";
import type { TrialWithRelations } from "@/db/types";

export const TrialExtendDialog = ({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  const [selectedTrial] = useState<TrialWithRelations | null>(null);
  const [extendDate, setExtendDate] = useState("");

  const handleConfirmExtend = () => {
    if (selectedTrial && extendDate) {
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extender Prueba Gratuita</DialogTitle>
          <DialogDescription>
            Selecciona la nueva fecha de finalización para "
            {selectedTrial?.business?.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="extend-date">Nueva Fecha de Finalización</Label>
            <Input
              id="extend-date"
              type="date"
              value={extendDate}
              onChange={(e) => setExtendDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          {selectedTrial && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="font-medium">Fecha actual de finalización:</div>
              <div className="text-muted-foreground">
                {new Date(selectedTrial.expiresAt).toLocaleDateString("es-AR")}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmExtend}>Extender Trial</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
