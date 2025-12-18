"use client";

import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/app/shared/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/dashboard/products", icon: Package },
  { name: "Mi Negocio", href: "/dashboard/business", icon: Store },
  { name: "EstadÃ­sticas", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "SuscripciÃ³n", href: "/dashboard/subscription", icon: CreditCard },
  { name: "ConfiguraciÃ³n", href: "/dashboard/settings", icon: Settings },
];

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
      <nav className="flex-1 px-3 lg:py-4">
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
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto w-full px-3">
        <Button asChild className="w-full">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </aside>
  );
}
