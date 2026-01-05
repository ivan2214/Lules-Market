import { headers } from "next/headers";
import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { auth } from "@/lib/auth";
import { AppLogo } from "@/shared/components/app-logo";

async function AuthLayout({ children }: React.PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect(pathsConfig.dashboard.root);
  }

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <section>
        <div className="flex flex-col gap-6">
          <AppLogo />
          {children}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
