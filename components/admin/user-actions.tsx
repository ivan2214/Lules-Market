"use client";

import { Ban, CheckCircle, Eye, MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  bannedUser,
  unbannedUser,
} from "@/app/admin/users/actions/banned-user";
import type { UserDTO } from "@/app/data/user/user.dto";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "../ui/spinner";

interface UserActionsProps {
  user: UserDTO;
  onViewDetails: (userId: string) => void;
}

export function UserActions({ user, onViewDetails }: UserActionsProps) {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleBan = (userId: string) => {
    startTransition(async () => {
      bannedUser(userId)
        .then((res) => {
          res.ok
            ? toast.success(`El usuario ${user?.name} fue baneado`)
            : toast.error(res.error);
        })
        .catch((error) =>
          toast.error("Ocurrio un error", {
            description() {
              return JSON.stringify(error);
            },
          }),
        );
    });
  };

  const handleUnban = (userId: string) => {
    startTransition(async () => {
      unbannedUser(userId)
        .then((res) => {
          res.ok
            ? toast.info(`El usuario ${user?.name} fue desbaneado`)
            : toast.error(res.error);
        })
        .catch((error) =>
          toast.error("Ocurrio un error", {
            description() {
              return JSON.stringify(error);
            },
          }),
        );
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={pending} variant="ghost" size="icon">
            {pending ? <Spinner /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewDetails(user.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          {user.bannedUser ? (
            <DropdownMenuItem
              onClick={() => setShowUnbanDialog(true)}
              className="text-green-600"
              disabled={pending}
            >
              {pending ? (
                <Spinner />
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Desbanear
                </>
              )}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setShowBanDialog(true)}
              className="text-destructive"
              disabled={pending}
            >
              {pending ? (
                <Spinner />
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Banear usuario
                </>
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Banear usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de banear a {user.name}. El usuario no podrá acceder
              al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleBan(user.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Banear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showUnbanDialog} onOpenChange={setShowUnbanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desbanear usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de desbanear a {user.name}. El usuario podrá acceder
              nuevamente al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUnban(user.id)}>
              Desbanear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
