import type { ReactNode } from "react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="mx-auto flex min-h-screen flex-col">
      <PublicNavbar />
      {children}
      <PublicFooter />
    </main>
  );
};

export default AuthLayout;
