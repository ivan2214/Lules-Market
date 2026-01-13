import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentSession } from "@/data/session/get-current-session";
import { db } from "@/db";
import { admin, business, notification, profile } from "@/db/schema";
import { SearchForm } from "@/shared/components/search-form";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
            <Skeleton className="h-9 w-36" />
          </div>
        }
      >
        <NavigationWrapperContent />
      </Suspense>
    </div>
  );
};

const NavigationWrapperContent = async () => {
  const { session } = await getCurrentSession();

  const { user } = session || {};

  if (!user)
    return (
      <>
        <Button asChild className="hidden md:flex">
          <Link href="/para-comercios">Para comercios</Link>
        </Button>
        <MobileMenu />
      </>
    );

  const adminDB = await db.query.admin.findFirst({
    where: eq(admin.userId, user.id),
    with: {
      user: true,
    },
  });

  const businessDB = await db.query.business.findFirst({
    where: eq(business.id, user.id),
    with: { logo: true, coverImage: true },
  });

  const userProfile = await db.query.profile.findFirst({
    where: eq(profile.userId, user.id),
    with: { avatar: true, user: true },
  });

  const notificationsForUser = await db.query.notification.findMany({
    where: eq(notification.userId, user.id),
    orderBy: [desc(notification.createdAt)],
  });

  const avatar =
    userProfile?.avatar?.url ||
    businessDB?.logo?.url ||
    adminDB?.user?.image ||
    user.image;
  const email = userProfile?.user?.email || adminDB?.user?.email || user.email;
  const name =
    userProfile?.name || businessDB?.name || adminDB?.user?.name || user.name;

  const isBusiness = !!businessDB;

  const isAdmin = !!adminDB;

  return (
    <div className="flex items-center gap-2">
      {email && name && <Notifications notifications={notificationsForUser} />}
      {email && name && (
        <UserMenu
          avatar={avatar}
          email={email}
          name={name}
          isBusiness={isBusiness}
          isAdmin={isAdmin}
          businessId={businessDB?.id}
        />
      )}
      {/* Mobile Menu */}
      <MobileMenu isLoggedIn={!!session} />
    </div>
  );
};
