import {
  CreditCard,
  Info,
  type LucideProps,
  ShoppingBag,
  Store,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export const CONTACT_TYPES = {
  whatsapp: "WhatsApp",
  phone: "Teléfono",
  email: "Email",
  website: "Sitio Web",
  facebook: "Facebook",
  instagram: "Instagram",
} as const;

type navigationItem = {
  name: string;
  href: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export const navigation: navigationItem[] = [
  { name: "Inicio", href: "/", icon: Store },
  { name: "Productos", href: "/explorar/productos", icon: ShoppingBag },
  { name: "Comercios", href: "/explorar/comercios", icon: Store },
  { name: "Planes", href: "/planes", icon: CreditCard },
  { name: "Preguntas Frecuentes", href: "/faq", icon: Info },
];

export const footerNavigation: {
  plataforma: navigationItem[];
  comercio: navigationItem[];
  legal: navigationItem[];
} = {
  plataforma: [
    {
      name: "Explorar Productos",
      href: "/explorar/productos",
    },
    {
      name: "Explorar Comercios",
      href: "/explorar/comercios",
    },
    {
      name: "Planes",
      href: "/planes",
    },
    {
      name: "Qué es Lules Market",
      href: "/que-es",
    },
    {
      name: "Preguntas Frecuentes",
      href: "/faq",
    },
    {
      name: "Roadmap",
      href: "/roadmap",
    },
  ],
  comercio: [
    {
      name: "Registrar Comercio",
      href: "/auth/signup",
    },
    {
      name: "Iniciar Sesión",
      href: "/auth/signin",
    },
    {
      name: "Panel de Control",
      href: "/dashboard",
    },
  ],
  legal: [
    {
      name: "Política de Privacidad",
      href: "/privacidad",
    },
    {
      name: "Términos y Condiciones",
      href: "/terminos",
    },
    {
      name: "Política de Cookies",
      href: "/politica-de-cookies",
    },
  ],
};
