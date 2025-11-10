import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchForm } from "../search-form";
import { UserMenuWrapper } from "../wrappers/user-menu-wrapper";

export function PublicNavbar() {
  return (
    <header className="container sticky top-0 z-50 mx-auto w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-10">
      <div className="flex h-14 w-full items-center justify-between gap-2">
        <Link href="/" className="w-32">
          <Image
            src="/logo-tp.png"
            width={48}
            height={48}
            className="h-full w-full object-cover"
            alt="Logo"
          />
        </Link>

        <SearchForm />

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link href="/explorar">Explorar</Link>
          </Button>

          <UserMenuWrapper />
        </div>
      </div>
    </header>
  );
}
