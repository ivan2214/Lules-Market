import type { navigationItem } from "@/shared/types";

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
