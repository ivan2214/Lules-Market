"use client";

import {
  Ban,
  CheckCircle,
  CreditCard,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import type { SubscriptionPlan } from "@/app/generated/prisma";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Business } from "@/types/admin";

interface BusinessActionsProps {
  business: Business;
  onBan: (businessId: string) => void;
  onUnban: (businessId: string) => void;
  onChangePlan: (businessId: string, plan: SubscriptionPlan) => void;
  onViewDetails: (businessId: string) => void;
}

export function BusinessActions({
  business,
  onBan,
  onUnban,
  onChangePlan,
  onViewDetails,
}: BusinessActionsProps) {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(
    business.plan,
  );

  const handleChangePlan = () => {
    onChangePlan(business.id, selectedPlan);
    setShowPlanDialog(false);
  };

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
          <DropdownMenuItem onClick={() => onViewDetails(business.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowPlanDialog(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Cambiar plan
          </DropdownMenuItem>
          {business.isBanned ? (
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
              Banear negocio
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Banear negocio?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de banear {business.name}. El negocio no será
              visible en la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onBan(business.id)}
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
            <AlertDialogTitle>¿Desbanear negocio?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de desbanear {business.name}. El negocio será
              visible nuevamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => onUnban(business.id)}>
              Desbanear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Plan</DialogTitle>
            <DialogDescription>
              Selecciona el nuevo plan para {business.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Select
                value={selectedPlan}
                onValueChange={(value) =>
                  setSelectedPlan(value as SubscriptionPlan)
                }
              >
                <SelectTrigger id="plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">FREE</SelectItem>
                  <SelectItem value="BASIC">BASIC</SelectItem>
                  <SelectItem value="PREMIUM">PREMIUM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePlan}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
