// user-menu-wrapper.tsx

import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { getCurrentUser } from "@/app/data/user/require-user";
import prisma from "@/lib/prisma";
import { UserMenu } from "../auth/user-menu";
import { PublicMenuMobile } from "../public/menu-mobile";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

// ⬇️ componente que realmente obtiene la info
async function UserMenuContent() {
  await connection();
  const session = await getCurrentUser();

  if (!session?.id) {
    return (
      <>
        <Button asChild className="hidden md:flex">
          <Link href="/para-comercios">Para comercios</Link>
        </Button>
        <PublicMenuMobile isLoggedIn={false} />
      </>
    );
  }

  const business = await prisma.business.findUnique({
    where: { id: session.id },
    include: { logo: true, coverImage: true },
  });

  const isLoggedIn = business !== null;

  return (
    <>
      {business ? (
        <UserMenu business={business} />
      ) : (
        <Button asChild className="hidden md:flex">
          <Link href="/para-comercios">Para comercios</Link>
        </Button>
      )}
      <PublicMenuMobile isLoggedIn={isLoggedIn} />
    </>
  );
}

export function UserMenuWrapper() {
  return (
    <Suspense fallback={<UserMenuWrapperSkeleton />}>
      {/* ⬇️ carga dentro del Suspense */}
      <UserMenuContent />
    </Suspense>
  );
}

export const UserMenuWrapperSkeleton = () => <Skeleton className="h-8 w-24" />;
