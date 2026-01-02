"use client";
import { Database, RefreshCcw, Shield, Trash2 } from "lucide-react"; // Iconos
import { useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { clearUsersCache } from "./actions";

export const ClearCacheDb = ({
  data,
}: {
  data: {
    users: number;
    sessions: number;
    accounts: number;
    businesses: number;
    admin: number;
    account: number;
  };
}) => {
  const [isPending, startTransition] = useTransition();

  const handleClearUsers = () => {
    startTransition(async () => {
      try {
        const [error] = await clearUsersCache();
        if (error) {
          toast.error(error.message || "Error al purgar caché");
        } else {
          toast.success("Caché de usuarios purgada");
        }
      } catch (error) {
        toast.error(
          `${error instanceof Error ? error.message : "Ocurrió un error inesperado"}`,
        );
      }
    });
  };

  return (
    <div className="flex w-full max-w-[300px] flex-col gap-4 p-1">
      {/* Encabezado Compacto */}
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="flex items-center gap-2 font-semibold text-sm">
          <Database className="h-4 w-4 text-blue-500" />
          DB Stats
        </h3>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Development
        </span>
      </div>

      <ScrollArea className="h-full max-h-[300px] pr-3">
        <div className="flex flex-col gap-3">
          {/* Sección: Entidades Principales */}
          <div className="space-y-1.5">
            <p className="font-bold text-[10px] text-muted-foreground uppercase">
              Entidades
            </p>
            <StatRow label="Usuarios" value={data.users} />
            <StatRow label="Negocios" value={data.businesses} />
            <StatRow label="Cuentas" value={data.accounts} />
            <StatRow label="Admins" value={data.admin} variant="destructive" />
          </div>

          {/* Sección: Seguridad y Sesiones */}
          <div className="space-y-1.5">
            <p className="flex items-center gap-1 font-bold text-[10px] text-muted-foreground uppercase">
              <Shield className="h-3 w-3" /> Seguridad
            </p>
            <StatRow
              label="Sesiones"
              value={data.sessions}
              variant="secondary"
            />
          </div>
        </div>
      </ScrollArea>

      {/* Botón de Acción */}
      <Button
        size="sm"
        variant="destructive"
        className="mt-2 h-8 w-full font-medium text-xs"
        onClick={handleClearUsers}
        disabled={isPending}
      >
        {isPending ? (
          <RefreshCcw className="mr-2 h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="mr-2 h-3 w-3" />
        )}
        {isPending ? "Limpiando..." : "Purgar Caché"}
      </Button>
    </div>
  );
};

// Subcomponente para filas compactas
const StatRow = ({
  label,
  value,
  variant = "secondary",
}: {
  label: string;
  value: number;
  variant?: "default" | "secondary" | "destructive" | "outline";
}) => (
  <div className="group flex items-center justify-between rounded p-1 text-xs transition-colors hover:bg-muted/50">
    <span className="font-medium text-muted-foreground">{label}</span>
    <Badge
      variant={variant}
      className="pointer-events-none h-5 min-w-8 justify-center px-1.5"
    >
      {value}
    </Badge>
  </div>
);
