"use client";

import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, MoreHorizontal, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TrialWithRelations } from "@/db/types";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Calendar as CalendarComponent } from "@/shared/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { useTrialMutations } from "../../_hooks/use-admin-mutations";

interface TrialActionsProps {
  trial: TrialWithRelations & { daysRemaining: number };
}

export function TrialActions({ trial }: TrialActionsProps) {
  const [extendOpen, setExtendOpen] = useState(false);
  const [newEndDate, setNewEndDate] = useState<Date>(
    addDays(new Date(trial.expiresAt || addDays(new Date(), 30)), 30),
  );

  const { extendTrial, cancelTrial } = useTrialMutations();

  const handleExtend = async () => {
    try {
      await extendTrial.mutateAsync({ id: trial.id, newEndDate });
      toast.success("Trial extendido", {
        description: "La fecha de expiración ha sido actualizada.",
      });
      setExtendOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "No se pudo extender el trial",
      });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelTrial.mutateAsync(trial.id);
      toast.success("Trial cancelado", {
        description: "El período de prueba ha sido cancelado.",
      });
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "No se pudo cancelar el trial",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setExtendOpen(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Extender
          </DropdownMenuItem>
          {trial.isActive && (
            <DropdownMenuItem
              onClick={handleCancel}
              disabled={cancelTrial.isPending}
              className="text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancelar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={extendOpen} onOpenChange={setExtendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extender Trial</DialogTitle>
            <DialogDescription>
              Selecciona la nueva fecha de expiración para el trial de{" "}
              {trial.business?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(newEndDate, "PPP", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={newEndDate}
                  onSelect={(date) => date && setNewEndDate(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExtend} disabled={extendTrial.isPending}>
              {extendTrial.isPending ? "Extendiendo..." : "Extender"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
