import {
  Building2,
  CreditCard,
  HandCoins,
  Layers,
  LayoutDashboard,
  Package,
  ScrollText,
  Users,
} from "lucide-react";
import pathsConfig from "@/config/paths.config";
import type { NavPrimaryItem } from "@/shared/components/sidebar/nav-primary";

export const navPrimaryDataAdmin: Array<NavPrimaryItem> = [
  {
    title: "Dashboard",
    url: pathsConfig.admin.root,
    icon: LayoutDashboard,
    role: "ADMIN",
  },
  {
    title: "Users",
    url: pathsConfig.admin.users,
    icon: Users,
    role: "ADMIN",
  },
  {
    title: "Grants",
    url: pathsConfig.admin.grants,
    icon: HandCoins,
    role: "ADMIN",
  },
  {
    title: "Payments",
    url: pathsConfig.admin.payments,
    icon: CreditCard,
    role: "ADMIN",
  },
  {
    title: "Logs",
    url: pathsConfig.admin.logs,
    icon: ScrollText,
    role: "ADMIN",
  },
  {
    title: "Entities",
    url: pathsConfig.admin.entities,
    icon: Building2,
    role: "ADMIN",
  },
  {
    title: "Products",
    url: pathsConfig.admin.products,
    icon: Package,
    role: "ADMIN",
  },
  {
    title: "Plans",
    url: pathsConfig.admin.plans,
    icon: Layers,
    role: "ADMIN",
  },
];
