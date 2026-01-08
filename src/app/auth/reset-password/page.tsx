import Link from "next/link";

import { ResetPasswordForm } from "@/shared/components/auth/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Restablecer contraseña</CardTitle>
        <CardDescription>
          Introduce tu nueva contraseña para restablecer tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ResetPasswordForm token={token} />
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
