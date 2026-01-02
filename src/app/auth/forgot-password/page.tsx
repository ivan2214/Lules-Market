import Link from "next/link";

import { ForgotPasswordForm } from "@/shared/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Restablecer contraseña</CardTitle>
        <CardDescription>
          Introduce tu correo electrónico para restablecer tu contraseña
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ForgotPasswordForm />
        <div className="text-center text-sm">
          Volver a{" "}
          <Link href="/auth/sign-in" className="underline underline-offset-4">
            Iniciar sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
