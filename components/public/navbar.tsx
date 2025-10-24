import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/app/data/user/require-user";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { UserMenu } from "../auth/user-menu";
import { SearchForm } from "../search-form";
import { PublicMenuMobile } from "./menu-mobile";

export async function PublicNavbar() {
  const session = await getCurrentUser();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.id || "",
    },
    include: {
      business: {
        include: {
          logo: true,
          coverImage: true,
        },
      },
    },
  });

  return (
    <header className="container sticky top-0 z-50 mx-auto w-full border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-10">
      <div className="flex w-full items-center justify-between gap-2">
        <Link href="/">
          <div className="h-20 w-20 border">
            <Image
              src="/logo-tp.png"
              width={48}
              height={48}
              className="aspect-square h-full w-full object-cover object-center"
              alt=""
            />
          </div>
        </Link>
        <SearchForm />
        {user ? (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex">
              <Button asChild variant="ghost">
                <Link href="/explorar">Explorar</Link>
              </Button>
            </div>
            <UserMenu user={user} />
            <div className="flex md:hidden">
              <PublicMenuMobile isLoggedIn={!!user} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex md:hidden">
              <PublicMenuMobile />
            </div>
            <nav className="hidden items-center gap-2 md:flex">
              <Button asChild variant="ghost">
                <Link href="/explorar">Explorar</Link>
              </Button>

              <Button asChild>
                <Link href="/para-comercios">Para comercios</Link>
              </Button>
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
