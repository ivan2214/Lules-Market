"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { deleteBusinessAction } from "@/app/actions/business-actions";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { signOut } from "@/lib/auth-client";

export function DangerZone() {
  const router = useRouter();
  const { pending, execute } = useAction({
    action: deleteBusinessAction,
    options: {
      showToasts: true,
      onSuccess({ successMessage }) {
        if (successMessage) {
          signOut();
          router.push("/");
        }
      },
    },
  });

  const handleDeleteAccount = () => {
    startTransition(() => {
      execute();
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
