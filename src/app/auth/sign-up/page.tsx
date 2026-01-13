import Link from "next/link";
import { api } from "@/lib/eden";
import { PasswordSignUpForm } from "@/shared/components/auth/password-sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default async function SignUpPage() {
  const { data: categories } = await api.category.public["list-all"].get();
  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Registrarse</CardTitle>
        <CardDescription>Registrate para comenzar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PasswordSignUpForm categories={categories || []} />
        <div className="text-center text-sm">
          Ya tienes una cuenta?{" "}
          <Link href="/auth/sign-in" className="underline underline-offset-4">
            Iniciar sesión
          </Link>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-balance text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
          Al registrarte, aceptas nuestros{" "}
          <Link href="#">Terminos de Servicio</Link> y{" "}
          <Link href="#">Política de Privacidad</Link>.
        </div>
      </CardFooter>
    </Card>
  );
}
