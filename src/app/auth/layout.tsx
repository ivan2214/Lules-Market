import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import pathsConfig from "@/config/paths.config";
import { auth } from "@/lib/auth";
import { AppLogo } from "@/shared/components/app-logo";
import { Footer } from "@/shared/components/footer";
import { Navigation } from "@/shared/components/navigation";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <main>
      <Navigation />
      <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <section className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          <AppLogo />
          <Suspense fallback={<AuthLoadingAlternative />}>
            <AuthCheckWrapper>{children}</AuthCheckWrapper>
          </Suspense>
        </section>
      </section>
      <Footer />
    </main>
  );
}

async function AuthCheckWrapper({ children }: { children: React.ReactNode }) {
  await connection();
  const h = await headers();
  const session = await auth.api.getSession({
    headers: h,
  });

  if (session?.user) {
    redirect(pathsConfig.dashboard.root);
  }

  return <>{children}</>;
}

function AuthLoadingAlternative() {
  return (
    <div className="flex h-32 w-full animate-pulse items-center justify-center rounded-xl bg-muted/20">
      <div className="h-8 w-32 rounded bg-muted/40" />
    </div>
  );
}
