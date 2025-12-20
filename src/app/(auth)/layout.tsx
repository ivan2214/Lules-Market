import type { ReactNode } from "react";
import { PublicFooter } from "@/app/(public)/_components/footer";
import { Navigation } from "@/shared/components/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="mx-auto flex min-h-screen flex-col">
      <Navigation />
      <section className="flex min-h-screen items-center justify-center py-8">
        {children}
      </section>
      <PublicFooter />
    </main>
  );
};

export default AuthLayout;
