import Link from "next/link";

import { OAuthProviders } from "@/shared/components/auth/oauth-providers";
import { PasswordSignInForm } from "@/shared/components/auth/password-sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Iniciar sesión</CardTitle>
        <CardDescription>Ingresa a tu cuenta para continuar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <OAuthProviders />
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            O continuar con
          </span>
        </div>
        <PasswordSignInForm />
        <div className="text-center text-sm">
          No tienes una cuenta?{" "}
          <Link href="/auth/sign-up" className="underline underline-offset-4">
            Registrate
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
