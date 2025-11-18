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
      {children}
      <PublicFooter />
    </main>
  );
};

export default AuthLayout;
