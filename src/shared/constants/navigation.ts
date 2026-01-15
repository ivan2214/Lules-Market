import { Building, CreditCard, Info, ShoppingBag, Store } from "lucide-react";
import type { navigationItem } from "@/shared/types";

export const navigation: navigationItem[] = [
  { name: "Inicio", href: "/", icon: Store },
  {
    name: "Productos",
    href: "/explorar/productos",
    icon: ShoppingBag,
    description: "Aquí encontrarás todos los productos disponibles",
  },
  {
    name: "Comercios",
    href: "/explorar/comercios",
    icon: Store,
    description: "Aquí encontrarás todos los comercios disponibles",
  },
  {
    name: "Planes",
    href: "/planes",
    icon: CreditCard,
    description:
      "Informacion sobre planes disponibles, precios y características",
  },
  {
    name: "Para comercios",
    href: "/para-comercios",
    icon: Building,
    description: "Toda la informacion para comercios",
  },
  {
    name: "Que es Lules Market",
    href: "/que-es",
    icon: Info,
    description: "Conoce todo sobre nuestra plataforma",
  },
];
