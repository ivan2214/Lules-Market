"use client";

import { Building2, Calendar, Info, Shield, User } from "lucide-react";
import type { BusinessWithRelations, UserWithRelations } from "@/db/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Separator } from "@/shared/components/ui/separator";

export type UserEnhanced = Omit<UserWithRelations, "business"> & {
  business?: BusinessWithRelations | null;
};

export type Entity = UserEnhanced | BusinessWithRelations;

interface EntityDetailsModalProps {
  type: "user" | "business";
  entity: Entity;
  isOpen: boolean;
  onClose: () => void;
}

export function EntityDetailsModal({
  type,
  entity,
  isOpen,
  onClose,
}: EntityDetailsModalProps) {
  if (!entity) return null;

  const isUser = type === "user";
  const title = isUser ? "Detalles del Usuario" : "Detalles del Comercio";
  const icon = isUser ? (
    <User className="h-5 w-5" />
  ) : (
    <Building2 className="h-5 w-5" />
  );

  // Helper casts for type safety within conditional blocks
  const userEntity = isUser ? (entity as UserEnhanced) : null;
  const businessEntity = !isUser ? (entity as BusinessWithRelations) : null;

  // Normalize data for display
  const name = entity.name || "Sin nombre";
  const email = isUser ? userEntity?.email : businessEntity?.user?.email;

  // Status is primarily for Business (from businessStatusEnum), User currently doesn't have a status field in schema
  const status = !isUser ? businessEntity?.status : null;

  const createdAt = new Date(entity.createdAt || "").toLocaleDateString(
    "es-AR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  // Specific fields
  const role = isUser ? userEntity?.role : null;
  const businessName = isUser
    ? userEntity?.business?.name
    : businessEntity?.name;
  const ownerName = !isUser ? businessEntity?.user?.name || "Sin nombre" : null;

  // Plan name logic
  // If User: check their associated business -> currentPlan -> plan
  // If Business: check currentPlan -> plan
  const planName = !isUser
    ? businessEntity?.currentPlan?.plan?.name || "Gratis"
    : userEntity?.business?.currentPlan?.plan?.name;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          <DialogDescription>
            Información completa de {isUser ? "este usuario" : "este comercio"}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Header Info */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <span className="font-semibold text-2xl">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
            {status && (
              <Badge
                variant={
                  status === "ACTIVE"
                    ? "default"
                    : status === "SUSPENDED"
                      ? "destructive"
                      : "secondary"
                }
              >
                {status === "ACTIVE"
                  ? "Activo"
                  : status === "SUSPENDED"
                    ? "Suspendido"
                    : "Pendiente"}
              </Badge>
            )}
            {role && (
              <Badge variant={role === "ADMIN" ? "default" : "secondary"}>
                {role}
              </Badge>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            {/* Common Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                Registrado el
              </div>
              <p className="font-medium text-sm">{createdAt}</p>
            </div>

            {/* Business Specific or Linked Info */}
            {!isUser && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <User className="h-4 w-4" />
                  Propietario
                </div>
                <div className="text-right">
                  <p className="text-right font-medium text-sm">{ownerName}</p>
                  {email && (
                    <p className="text-muted-foreground text-xs">{email}</p>
                  )}
                </div>
              </div>
            )}

            {isUser && businessName && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Building2 className="h-4 w-4" />
                  Comercio Asociado
                </div>
                <p className="font-medium text-sm">{businessName}</p>
              </div>
            )}

            {/* Plan Info */}
            {planName && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Shield className="h-4 w-4" />
                  Plan Actual
                </div>
                <Badge variant="outline">{planName}</Badge>
              </div>
            )}

            {/* ID for technical reference */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Info className="h-3 w-3" />
                ID de {isUser ? "Usuario" : "Comercio"}
              </div>
              <p className="copy-all select-all font-mono text-muted-foreground text-xs">
                {entity.id}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
