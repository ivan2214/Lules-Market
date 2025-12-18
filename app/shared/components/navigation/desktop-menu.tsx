"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/app/shared/components/ui/button";
import { Skeleton } from "@/app/shared/components/ui/skeleton";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const DesktopMenu = () => {
  const pathname = usePathname();
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navigation.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn("gap-2", pathname === item.href && "bg-secondary")}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {item.name}
          </Button>
        </Link>
      ))}
    </nav>
  );
};

export const DesktopMenuSkeleton = () => {
  return (
    <nav className="hidden items-center gap-1 md:flex">
      {navigation.map((item) => (
        <Skeleton key={item.href} className="h-10 w-24" />
      ))}
    </nav>
  );
};
