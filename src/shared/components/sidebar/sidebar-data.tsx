import { LayoutDashboard, Package, Table, Users2 } from "lucide-react";
import pathsConfig from "@/config/paths.config";

import type { NavPrimaryItem } from "./nav-primary";
import type { NavResourceItem } from "./nav-resources";

export const navPrimaryData: Array<NavPrimaryItem> = [
  {
    title: "Dashboard",
    url: pathsConfig.admin.root,
    icon: LayoutDashboard,
  },
];

export const navResourceShopData: Array<NavResourceItem> = [
  {
    title: "Products",
    url: "#",
    icon: Table,
    disabled: true,
  },
  {
    title: "Orders",
    url: "#",
    icon: Package,
    disabled: true,
  },
  {
    title: "Customers",
    url: "#",
    icon: Users2,
    disabled: true,
  },
];

export const searchCommandData: Record<string, Array<NavPrimaryItem>> = {
  Suggestions: navPrimaryData,
  Shop: navResourceShopData,
};
