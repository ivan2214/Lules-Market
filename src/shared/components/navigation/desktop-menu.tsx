"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { navigation } from "@/shared/constants/navigation";

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
