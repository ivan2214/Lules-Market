import Link from "next/link";
import { SignUpForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para comenzar a publicar tus productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <p className="mt-4 text-center text-muted-foreground text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/signin" className="font-medium underline">
              Inicia sesión aquí
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
