"use client";

import { Clock, Mail } from "lucide-react";

interface VerificationPendingProps {
  email?: string;
}

export function VerificationPending({ email }: VerificationPendingProps) {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
          <Mail className="h-10 w-10 text-amber-500" />
        </div>
        <div className="-bottom-1 -right-1 absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-background">
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight">
          Verifica tu correo electrónico
        </h2>
        <p className="max-w-sm text-muted-foreground">
          Hemos enviado un enlace de verificación a{" "}
          {email ? (
            <span className="font-medium text-foreground">{email}</span>
          ) : (
            "tu correo electrónico"
          )}
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          <span className="text-muted-foreground text-sm">
            Esperando verificación...
          </span>
        </div>
      </div>
    </div>
  );
}
