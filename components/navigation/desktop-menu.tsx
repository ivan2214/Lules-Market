"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

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
            <item.icon className="h-4 w-4" />
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
