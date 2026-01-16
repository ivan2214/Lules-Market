"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export function VerificationSuccess() {
  return (
    <div className="flex flex-col items-center space-y-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-2xl tracking-tight">
          ¡Correo verificado!
        </h2>
        <p className="max-w-sm text-muted-foreground">
          Tu dirección de correo electrónico ha sido verificada exitosamente.
          Ahora puedes acceder a tu cuenta.
        </p>
      </div>

      <Button asChild className="gap-2">
        <Link href="/auth/sign-in">
          Iniciar sesión
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
