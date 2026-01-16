"use client";

import { RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface VerificationErrorProps {
  error?: string;
  onRetry?: () => void;
}

export function VerificationError({ error, onRetry }: VerificationErrorProps) {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight">
          Error de verificación
        </h2>
        <p className="max-w-sm text-muted-foreground">
          {error ||
            "No pudimos verificar tu correo electrónico. El enlace puede haber expirado o ser inválido."}
        </p>
      </div>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          <RefreshCw className="h-4 w-4" />
          Intentar de nuevo
        </Button>
      )}
    </div>
  );
}
