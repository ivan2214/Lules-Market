import { Users } from "lucide-react";
import pathsConfig from "@/config/paths.config";
import type { NavPrimaryItem } from "@/shared/components/sidebar/nav-primary";

/* grants
payments
logs
entities
products */

export const navPrimaryDataAdmin: Array<NavPrimaryItem> = [
  {
    title: "Users",
    url: pathsConfig.admin.users,
    icon: Users,
    role: "ADMIN",
  },
  {
    title: "Grants",
    url: pathsConfig.admin.grants,
    icon: Users,
    role: "ADMIN",
  },
  {
    title: "Payments",
    url: pathsConfig.admin.payments,
    icon: Users,
    role: "ADMIN",
  },
  {
    title: "Logs",
    url: pathsConfig.admin.logs,
    icon: Users,
    role: "ADMIN",
  },
  {
    title: "Entities",
    url: pathsConfig.admin.entities,
    icon: Users,
    role: "ADMIN",
  },
  {
    title: "Products",
    url: pathsConfig.admin.products,
    icon: Users,
    role: "ADMIN",
  },
];
