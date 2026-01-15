"use client";

import Link from "next/link";
import type { Notification } from "@/db/types";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSession } from "@/shared/hooks/use-session";
import { MobileMenu } from "./mobile-menu";
import { Notifications } from "./notifications";
import { UserMenu } from "./user-menu";

export const NavigationWrapper = () => {
  // ✅ Usa isPending para manejar el loading state
  const { data, isPending, isLoading } = useSession();

  // Mostrar skeleton mientras carga
  if (isPending || isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-36" />
      </div>
    );
  }

  const { user, admin, business } = data || {};

  // Si no hay usuario
  if (!user) {
    return (
      <>
        <Button asChild className="hidden md:flex">
          <Link href="/para-comercios">Para comercios</Link>
        </Button>
        <MobileMenu />
      </>
    );
  }

  const avatar = business?.logo?.url || admin?.user?.image || user.image;
  const email = admin?.user?.email || user.email;
  const name = business?.name || admin?.user?.name || user.name;
  const isBusiness = !!business;
  const isAdmin = !!admin;
  const notificationsForUser = user.notifications || [];

  return (
    <div className="flex items-center gap-2">
      {email && name && (
        <Notifications notifications={notificationsForUser as Notification[]} />
      )}
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
      <MobileMenu isLoggedIn={true} />
    </div>
  );
};
