import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "@/app/auth/_components/signin-form";
import { SignInFormSkeleton } from "@/app/shared/components/skeletons/sign-in-form-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>
          Ingresa a tu cuenta para gestionar tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<SignInFormSkeleton />}>
          <SignInForm />
        </Suspense>
        <p className="mt-4 text-center text-muted-foreground text-sm">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/signup" className="font-medium underline">
            Regístrate aquí
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
