import { LayoutDashboard, Settings } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import pathsConfig from "@/config/paths.config";
import { auth } from "@/lib/auth";
import { NavUser } from "@/shared/components/marketing/nav-user";
import { Button } from "@/shared/components/ui/button";

export async function AppHeader() {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  const user = data?.user;

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-6">
        <Link href="/home" className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm">
            ~
          </div>
          <span className="font-semibold">Next Bard</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/home">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href={pathsConfig.dashboard.account.root}>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        {user && <NavUser user={user} />}
      </div>
    </header>
  );
}
