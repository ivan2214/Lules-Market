import { Users } from "lucide-react";
import pathsConfig from "@/config/paths.config";
import type { NavPrimaryItem } from "@/shared/components/sidebar/nav-primary";

export const navPrimaryDataAdmin: Array<NavPrimaryItem> = [
  {
    title: "Users",
    url: pathsConfig.admin.users,
    icon: Users,
    role: "ADMIN",
  },
];
