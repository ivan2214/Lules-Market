"use client";

import {
  Clock,
  CreditCard,
  ImageIcon,
  Layers,
  LayoutDashboard,
  Logs,
  Package,
  Shield,
  Store,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Negocios", href: "/admin/businesses", icon: Store },
  { name: "Productos", href: "/admin/products", icon: Package },
  { name: "Planes", href: "/admin/plans", icon: Layers },
  { name: "Pagos", href: "/admin/payments", icon: CreditCard },
  { name: "Cupones", href: "/admin/coupons", icon: Ticket },
  { name: "Trials", href: "/admin/trials", icon: Clock },
  { name: "Moderación", href: "/admin/media", icon: ImageIcon },
  { name: "Administradores", href: "/admin/admins", icon: Shield },

  { name: "Logs", href: "/admin/logs", icon: Logs },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="font-bold text-xl">Admin Panel</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
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
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={onClose}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
