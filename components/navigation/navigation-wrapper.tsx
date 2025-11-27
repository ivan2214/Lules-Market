import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { getCurrentUser } from "@/app/data/user/require-user";
import { SearchForm } from "@/components/search-form";
import prisma from "@/lib/prisma";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { MobileMenu } from "./mobile-menu";
import { Notifications } from "./notifications";
import { UserMenu } from "./user-menu";

export const NavigationWrapper = async () => {
  return (
    <div className="flex w-full items-center justify-between gap-2 lg:w-2/3">
      {/* Search Button - Mobile */}
      <SearchForm />

      {/* User Menu */}
      <Suspense
        fallback={
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        }
      >
        <NavigationWrapperContent />
      </Suspense>
    </div>
  );
};

const NavigationWrapperContent = async () => {
  await connection();
  const session = await getCurrentUser();

  if (!session)
    return (
      <>
        <Button asChild className="hidden md:flex">
          <Link href="/para-comercios">Para comercios</Link>
        </Button>
        <MobileMenu />
      </>
    );

  const admin = await prisma.admin.findUnique({
    where: { userId: session?.id },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  const business = await prisma.business.findUnique({
    where: { id: session?.id },
    include: { logo: true, coverImage: true },
  });

  const userProfile = await prisma.profile.findUnique({
    where: { userId: session?.id },
    include: { avatar: true, user: true },
  });

  const notificationsForUser = await prisma.notification.findMany({
    where: { userId: session?.id },
    orderBy: { createdAt: "desc" },
  });

  const avatar = userProfile?.avatar?.url || business?.logo?.url;
  const email =
    userProfile?.user.email || business?.email || admin?.user?.email;
  const name = userProfile?.name || business?.name || admin?.user?.name;

  const isBusiness = !!business;

  const isAdmin = !!admin;

  return (
    <div className="flex items-center gap-2">
      <Notifications notifications={notificationsForUser} />
      {email && name && (
        <UserMenu
          avatar={avatar}
          email={email}
          name={name}
          isBusiness={isBusiness}
          isAdmin={isAdmin}
          businessId={business?.id}
        />
      )}
      {/* Mobile Menu */}
      <MobileMenu isLoggedIn={!!session} />
    </div>
  );
};
