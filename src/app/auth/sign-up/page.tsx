import Link from "next/link";

import { OAuthProviders } from "@/shared/components/auth/oauth-providers";
import { PasswordSignUpForm } from "@/shared/components/auth/password-sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function SignUpPage() {
  return (
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Registrarse</CardTitle>
          <CardDescription>Registrate para comenzar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <OAuthProviders />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              O continuar con
            </span>
          </div>
          <PasswordSignUpForm />
          <div className="text-center text-sm">
            Ya tienes una cuenta?{" "}
            <Link href="/auth/sign-in" className="underline underline-offset-4">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Al registrarte, aceptas nuestros{" "}
        <Link href="#">Terminos de Servicio</Link> y{" "}
        <Link href="#">Política de Privacidad</Link>.
      </div>
    </>
  );
}
