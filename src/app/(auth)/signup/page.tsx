import Link from "next/link";
import { Suspense } from "react";

import { SignUpFormSkeleton } from "@/shared/components/skeletons/sign-up-form-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { SignUpForm } from "./_components/signup-form";

export default function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
        <CardDescription>
          Crea tus credenciales de acceso para comenzar a publicar tus
          productos. Luego deberás agregar los datos de tu comercio para
          completar el registro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SignUpFormSkeleton />}>
          <SignUpForm />
        </Suspense>
        <p className="mt-4 text-center text-muted-foreground text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/signin" className="font-medium underline">
            Inicia sesión aquí
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
