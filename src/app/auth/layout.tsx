import { headers } from "next/headers";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { auth } from "@/lib/auth";
import { AppLogo } from "@/shared/components/app-logo";
import { Footer } from "@/shared/components/footer";
import { Navigation } from "@/shared/components/navigation";

async function AuthLayout({ children }: React.PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect(pathsConfig.dashboard.root);
  }

  return (
    <main>
      <Navigation />
      <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <section className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          <AppLogo />
          {children}
        </section>
      </section>
      <Footer />
    </main>
  );
}

export default AuthLayout;
