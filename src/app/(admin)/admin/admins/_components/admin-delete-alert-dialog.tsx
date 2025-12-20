"use client";
import type { AdminWithRelations } from "@/db/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

type AdminDeleteAlertDialogProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  selectedAdmin: AdminWithRelations | null;
};

export const AdminDeleteAlertDialog: React.FC<AdminDeleteAlertDialogProps> = ({
  onOpenChange,
  open,
  selectedAdmin,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Remover permisos de administrador?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Estás a punto de remover los permisos de administrador de "
            {selectedAdmin?.user?.name}". El usuario perderá acceso al panel de
            administración.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground">
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
