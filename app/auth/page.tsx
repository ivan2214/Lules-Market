/* Pagina para comercios donde le indica que tiene que iniciar sesion o registrarse */

import { Store } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      {/* Contenedor principal */}
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border bg-card p-8 text-center shadow-lg backdrop-blur">
        {/* Icono y título */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-bold text-3xl">Comercios Locales</h1>
          <p className="text-base text-muted-foreground">
            Accedé a tu panel para gestionar tu negocio, productos y más.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex w-full flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/auth/signin">Iniciar sesión</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full">
            <Link href="/auth/signup">Crear cuenta</Link>
          </Button>
        </div>
      </div>

      {/* Fondo decorativo opcional */}
      <div className="-z-10 absolute inset-0 bg-grid-gray-100/[0.05]" />
    </div>
  );
}
