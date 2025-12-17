"use client";

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
import type { TrialWithRelations } from "@/db/types";

export const TrialFinishAlertDialog = ({
  onOpenChange,
  open,
  selectedTrial,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  selectedTrial: TrialWithRelations | null;
}) => {
  const handleEndTrial = (_trialId: string) => {};

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Finalizar prueba gratuita?</AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de finalizar la prueba gratuita de "
            {selectedTrial?.business?.name}". El negocio perderá acceso a las
            funciones del plan {selectedTrial?.plan}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => selectedTrial && handleEndTrial(selectedTrial.id)}
            className="bg-destructive text-destructive-foreground"
          >
            Finalizar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
