import { type ReactNode, Suspense } from "react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicNavbarSkeleton } from "@/components/skeletons/navbar-skeleton";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="mx-auto flex min-h-screen flex-col">
      <Suspense fallback={<PublicNavbarSkeleton />}>
        <PublicNavbar />
      </Suspense>
      {children}
      <PublicFooter />
    </main>
  );
};

export default AuthLayout;
