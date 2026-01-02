"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { orpc } from "@/orpc";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";

export function DangerZone() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { mutate } = useMutation(
    orpc.settings.deleteAccount.mutationOptions({
      onSuccess: () => {
        toast.success("Negocio eliminado");
        authClient.signOut();
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleDeleteAccount = () => {
    startTransition(async () => {
      mutate();
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 font-semibold text-lg">Eliminar Negocio</h3>
        <p className="mb-4 text-muted-foreground text-sm">
          Una vez que elimines tu negocio, no hay vuelta atrás. Por favor,
          asegúrate de que realmente quieres hacer esto.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={pending}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Negocio
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente
                tu negocio, tu negocio, todos tus productos, encuestas y datos
                asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sí, eliminar mi negocio
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
