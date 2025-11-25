import type { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { PublicFooter } from "@/components/public/footer";

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
