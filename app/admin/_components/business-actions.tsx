"use client";

import {
  Ban,
  CheckCircle,
  CreditCard,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  bannedBusiness,
  unbannedBusiness,
} from "@/app/admin/businesses/actions/banned-business";
import { changePlan } from "@/app/admin/businesses/actions/change-plan";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/shared/components/ui/alert-dialog";
import { Button } from "@/app/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/shared/components/ui/dropdown-menu";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/app/shared/components/ui/field";
import { Label } from "@/app/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select";
import { Spinner } from "@/app/shared/components/ui/spinner";
import { Switch } from "@/app/shared/components/ui/switch";
import type { BusinessWithRelations, PlanType } from "@/db/types";

interface BusinessActionsProps {
  business: BusinessWithRelations;
  onViewDetails: (businessId: string) => void;
}

export function BusinessActions({
  business,
  onViewDetails,
}: BusinessActionsProps) {
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(
    business.currentPlan?.planType || "FREE",
  );
  const [isTrial, setIsTrial] = useState(false); // flag para activar trial
  const [pending, startTransition] = useTransition();

  const handleBan = (businessId: string) => {
    startTransition(async () => {
      try {
        const [error, _data] = await bannedBusiness({ businessId });
        if (error) {
          toast.error(
            error.message || "OcurriÃ³ un error al banear el comercio",
          );
        } else {
          toast.success(`El comercio ${business?.name} fue baneado`);
        }
      } catch (err) {
        toast.error(
          `${err instanceof Error ? err.message : "OcurriÃ³ un error inesperado"}`,
        );
      }
    });
  };

  const handleUnban = (businessId: string) => {
    startTransition(async () => {
      try {
        const [error, _data] = await unbannedBusiness({ businessId });
        if (error) {
          toast.error(
            error.message || "OcurriÃ³ un error al desbanear el comercio",
          );
        } else {
          toast.info(`El comercio ${business?.name} fue desbaneado`);
        }
      } catch (err) {
        toast.error(
          `${err instanceof Error ? err.message : "OcurriÃ³ un error inesperado"}`,
        );
      }
    });
  };

  const handleChangePlan = () => {
    startTransition(async () => {
      try {
        const [error, data] = await changePlan({
          businessId: business.id,
          planType: selectedPlan,
          isTrial,
          trialDays: 30, // podes parametrizar
          planDurationDays: 30, // duraciÃ³n default del plan pagado
        });

        if (error) {
          toast.error(error.message || "Error al cambiar el plan");
        } else {
          toast.success(data?.message || "Plan actualizado correctamente");
          setShowPlanDialog(false);
        }
      } catch (error) {
        toast.error("OcurriÃ³ un error", {
          description: JSON.stringify(error),
        });
      }
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
          <DropdownMenuItem onClick={() => onViewDetails(business.id)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowPlanDialog(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Cambiar plan
          </DropdownMenuItem>
          {business.bannedBusiness ? (
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
                  Banear
                </>
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Â¿Banear negocio?</AlertDialogTitle>
            <AlertDialogDescription>
              EstÃ¡s a punto de banear {business.name}. El negocio no serÃ¡
              visible en la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleBan(business.id)}
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
            <AlertDialogTitle>Â¿Desbanear negocio?</AlertDialogTitle>
            <AlertDialogDescription>
              EstÃ¡s a punto de desbanear {business.name}. El negocio serÃ¡
              visible nuevamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUnban(business.id)}>
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
                onValueChange={(value) => setSelectedPlan(value as PlanType)}
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
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="trial">Activar trial</FieldLabel>
              <FieldDescription>
                Marcar si querÃ©s que este plan sea un perÃ­odo de prueba. Solo
                disponible si el plan actual estÃ¡ activo.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="trial"
              checked={isTrial}
              onCheckedChange={(checked) => setIsTrial(checked)}
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePlan} disabled={pending}>
              {pending ? <Spinner /> : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
