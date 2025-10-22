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
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/dashboard/products", icon: Package },
  { name: "Mi Negocio", href: "/dashboard/business", icon: Store },
  { name: "Estadísticas", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Suscripción", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="lg:w-64 lg:flex-col lg:border-r lg:bg-muted/40">
      <nav className="flex-1 px-3">
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
    </aside>
  );
}
