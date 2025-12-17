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
import { Switch } from "@/components/ui/switch";
import type { BusinessWithRelations, PlanType } from "@/db/types";
import { Field, FieldContent, FieldDescription, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";

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
      bannedBusiness(businessId)
        .then((res) => {
          res.ok
            ? toast.success(`El comercio ${business?.name} fue baneado`)
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

  const handleUnban = (businessId: string) => {
    startTransition(async () => {
      unbannedBusiness(businessId)
        .then((res) => {
          res.ok
            ? toast.info(`El comercio ${business?.name} fue desbaneado`)
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

  const handleChangePlan = () => {
    startTransition(async () => {
      try {
        const res = await changePlan({
          businessId: business.id,
          planType: selectedPlan,
          isTrial,
          trialDays: 30, // podes parametrizar
          planDurationDays: 30, // duración default del plan pagado
        });
        if (res.ok) {
          toast.success(res.message || "Plan actualizado correctamente");
          setShowPlanDialog(false);
        } else {
          toast.error(res.message || "Error al cambiar el plan");
        }
      } catch (error) {
        toast.error("Ocurrió un error", { description: JSON.stringify(error) });
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
            <AlertDialogTitle>¿Banear negocio?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de banear {business.name}. El negocio no será
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
            <AlertDialogTitle>¿Desbanear negocio?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de desbanear {business.name}. El negocio será
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
                Marcar si querés que este plan sea un período de prueba. Solo
                disponible si el plan actual está activo.
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
