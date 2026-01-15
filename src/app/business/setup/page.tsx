import Link from "next/link";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { getCurrentSession } from "@/data/session/get-current-session";
import { requireSession } from "@/data/session/require-session";
import { api } from "@/lib/eden";
import { AppLogo } from "@/shared/components/app-logo";
import { Footer } from "@/shared/components/footer";
import { Navigation } from "@/shared/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { SetupForm } from "./_components/setup-form";

export const dynamic = "force-dynamic"; // Añade esta línea
export const revalidate = 60;

export default async function BusinessSetup() {
  const { data: categories } = await api.category.public["list-all"].get();
  await requireSession();
  const { user } = await getCurrentSession();
  if (!user) {
    return redirect(pathsConfig.auth.signIn);
  }

  if (user.role === "ADMIN") {
    return redirect(pathsConfig.admin.root);
  }

  if (user.role === "BUSINESS") {
    return redirect(pathsConfig.dashboard.root);
  }

  return (
    <main>
      <Navigation />
      <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <section className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          <AppLogo />

          <Card className="w-full max-w-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                Completa los datos de tu negocio
              </CardTitle>
              <CardDescription>
                Para continuar con el registro de tu negocio, completa los datos
                solicitados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SetupForm
                categories={categories || []}
                userEmail={user?.email as string}
              />
              <div className="text-center text-sm">
                Todavia no tenes una cuenta?{" "}
                <Link
                  href={pathsConfig.auth.signUp}
                  className="underline underline-offset-4"
                >
                  Registrate
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
        </section>
      </section>
      <Footer />
    </main>
  );
}
