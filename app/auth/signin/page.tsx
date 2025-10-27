import Link from "next/link";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/signin-form";
import { SignInFormSkeleton } from "@/components/skeletons/sign-in-form-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-8">
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
    </div>
  );
}
