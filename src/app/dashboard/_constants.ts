import {
  BarChart,
  BarChart3,
  BookOpen,
  CreditCard,
  LayoutDashboard,
  Package,
  Store,
} from "lucide-react";
import pathsConfig from "@/config/paths.config";
import type { NavPrimaryItem } from "@/shared/components/sidebar/nav-primary";
import type { navigationItem } from "@/shared/types";
import type { SubscriptionErrorConfig, SubscriptionErrorType } from "./_types";

export const subscriptionErrors: Record<
  SubscriptionErrorType,
  SubscriptionErrorConfig
> = {
  subscription_expired: {
    title: "Suscripción vencida",
    description: "Tu suscripción expiró.",
    variant: "destructive",
  },
  subscription_required: {
    title: "Suscripción requerida",
    description: "Necesitas una suscripción para acceder a esta funcionalidad.",
    variant: "warning",
  },
  subscription_limit_reached: {
    title: "Has alcanzado el límite de productos para tu plan",
    description: "Mejora tu plan para agregar más productos.",
    variant: "warning",
  },
};

export const navigation: navigationItem[] = [
  { name: "Inicio", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/dashboard/products", icon: Package },
  { name: "Mi Negocio", href: "/dashboard/business", icon: Store },
  { name: "Estadísticas", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Suscripción", href: "/dashboard/subscription", icon: CreditCard },
];

export const navPrimaryDataDashboard: Array<NavPrimaryItem> = [
  {
    title: "Products",
    url: pathsConfig.dashboard.products,
    icon: BookOpen,
    role: "BUSINESS",
  },
  {
    title: "Analytics",
    url: pathsConfig.dashboard.analytics,
    icon: BarChart,
    role: "BUSINESS",
  },
  {
    title: "Subscription",
    url: pathsConfig.dashboard.subscription.root,
    icon: CreditCard,
    role: "BUSINESS",
  },
  /* {
            title:"Settings",
            url: pathsConfig.dashboard.settings,
            icon: Settings,
            role: "BUSINESS",
          } */
];
