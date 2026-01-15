import { Loader2 } from "lucide-react";

export function VerificationVerifying() {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="font-semibold text-xl tracking-tight">Verificando...</h2>
        <p className="max-w-sm text-muted-foreground text-sm">
          Estamos verificando tu correo electrónico. Por favor espera un
          momento.
        </p>
      </div>
    </div>
  );
}
