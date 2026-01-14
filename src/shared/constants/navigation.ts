import { CreditCard, Info, ShoppingBag, Store } from "lucide-react";
import type { navigationItem } from "@/shared/types";

export const navigation: navigationItem[] = [
  { name: "Inicio", href: "/", icon: Store },
  { name: "Productos", href: "/explorar/productos", icon: ShoppingBag },
  { name: "Comercios", href: "/explorar/comercios", icon: Store },
  { name: "Planes", href: "/planes", icon: CreditCard },
  { name: "Que es Lules Market", href: "/que-es", icon: Info },
];
