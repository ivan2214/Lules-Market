"use client";

import { Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { navigation } from "../_constants";

export function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="lg:w-64 lg:flex-col lg:border-r lg:bg-muted/40">
      <div className="hidden h-16 items-center border-b px-6 lg:flex">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Store className="h-6 w-6" />
          <span>Mi Comercio</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 lg:pt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              onClick={onClose}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
              {item.name}
            </Link>
          );
        })}
      </nav>
      <Separator className="my-4" />
      <div className="mt-auto w-full px-3">
        <Button variant="secondary" asChild className="w-full">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </aside>
  );
}
