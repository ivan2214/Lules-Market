"use client";

import { Ban, CheckCircle, Eye, MoreHorizontal } from "lucide-react";
import { useState } from "react";
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

interface UserActionsProps {
  user: UserDTO;
  onBan: (userId: string) => void;
  onUnban: (userId: string) => void;
  onViewDetails: (userId: string) => void;
}

export function UserActions({
  user,
  onBan,
  onUnban,
  onViewDetails,
}: UserActionsProps) {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
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
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Desbanear
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setShowBanDialog(true)}
              className="text-destructive"
            >
              <Ban className="mr-2 h-4 w-4" />
              Banear usuario
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
              onClick={() => onBan(user.id)}
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
            <AlertDialogAction onClick={() => onUnban(user.id)}>
              Desbanear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
