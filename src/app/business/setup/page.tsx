import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import pathsConfig from "@/config/paths.config";
import { listAllCategories } from "@/data/categories/get";
import { getCurrentSession } from "@/data/session/get-current-session";
import { requireSession } from "@/data/session/require-session";
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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SetupForm } from "./_components/setup-form";

export default function BusinessSetup() {
  return (
    <main>
      <Navigation />
      <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <section className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          <AppLogo />
          <Suspense fallback={<SetupFormFallback />}>
            <SetupFormWrapper />
          </Suspense>
        </section>
      </section>
      <Footer />
    </main>
  );
}

async function SetupFormWrapper() {
  await connection();
  const [categories, { user }] = await Promise.all([
    listAllCategories(),
    (async () => {
      await requireSession();
      return getCurrentSession();
    })(),
  ]);

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
          userEmail={user.email as string}
        />
      </CardContent>
    </Card>
  );
}

function SetupFormFallback() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-2 text-center">
        <Skeleton className="mx-auto h-7 w-64" />
        <Skeleton className="mx-auto h-4 w-80" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="mx-auto h-4 w-48" />
      </CardContent>
      <CardFooter>
        <Skeleton className="mx-auto h-3 w-72" />
      </CardFooter>
    </Card>
  );
}
