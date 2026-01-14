import type { navigationItem } from "@/shared/types";

export const footerNavigation: {
  explorar: navigationItem[];
  plataforma: navigationItem[];
  comercio: navigationItem[];
  legal: navigationItem[];
} = {
  plataforma: [
    {
      name: "Qué es Lules Market",
      href: "/que-es",
    },
    {
      name: "Cómo funciona",
      href: "/como-funciona",
    },
    {
      name: "Para clientes",
      href: "/para-clientes",
    },
    {
      name: "Para comercios",
      href: "/para-comercios",
    },
    {
      name: "Planes",
      href: "/planes",
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
  explorar: [
    {
      name: "Explorar Productos",
      href: "/explorar/productos",
    },
    {
      name: "Explorar Comercios",
      href: "/explorar/comercios",
    },
  ],
  comercio: [
    {
      name: "Registrar Comercio",
      href: "/auth/sign-up",
    },
    {
      name: "Iniciar Sesión",
      href: "/auth/sign-in",
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
