import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";
import { AppHeader } from "@/shared/components/app-header";

async function NavbarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
export default withAuthenticate(NavbarLayout);
