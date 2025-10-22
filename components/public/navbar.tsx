import { Store, User } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/actions/auth-actions";
import { SearchForm } from "../search-form";

export async function PublicNavbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-10">
      <div className="flex h-16 w-full items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Store className="h-6 w-6" />
          <span className="hidden sm:inline">Comercios Locales</span>
        </Link>
        <SearchForm />
        <nav className="flex items-center gap-2 overflow-x-scroll">
          <Button asChild variant="ghost">
            <Link href="/explorar">Explorar</Link>
          </Button>

          {session ? (
            <Button asChild>
              <Link href="/dashboard">
                <User className="mr-2 h-4 w-4" />
                Mi Panel
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/para-comercios">Para comercios</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
