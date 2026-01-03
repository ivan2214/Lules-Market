import type { User } from "better-auth";
import pathsConfig from "@/config/paths.config";
import { withAuthenticate } from "@/shared/components/acccess/with-authenticate";
import { AppBreadcrumbs } from "@/shared/components/app-breadcrumb";
import { Separator } from "@/shared/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { UserSidebar } from "@/shared/components/user/user-sidebar";

async function UserLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  return (
    <SidebarProvider>
      <UserSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withAuthenticate(UserLayout, {
  role: "user",
  redirect: pathsConfig.auth.signIn,
});
