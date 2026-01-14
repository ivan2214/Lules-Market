import {
  Building,
  Cookie,
  CreditCard,
  FileText,
  HelpCircle,
  Info,
  LayoutDashboard,
  Lightbulb,
  LogIn,
  Map as MapIcon,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserPlus,
  Users,
} from "lucide-react";
import type { navigationItem } from "@/shared/types";

export const navigationWithTitles: {
  explorar: navigationItem[];
  plataforma: navigationItem[];
  comercio: navigationItem[];
  legal: navigationItem[];
} = {
  plataforma: [
    {
      name: "Qué es Lules Market",
      href: "/que-es",
      icon: Info,
      description: "Conoce nuestra misión, visión y lo que nos hace únicos.",
    },
    {
      name: "Cómo funciona",
      href: "/como-funciona",
      icon: Lightbulb,
      description:
        "Aprende a utilizar la plataforma de manera sencilla y rápida.",
    },
    {
      name: "Para clientes",
      href: "/para-clientes",
      icon: Users,
      description:
        "Descubre los beneficios de comprar en los comercios locales.",
    },
    {
      name: "Para comercios",
      href: "/para-comercios",
      description: "Herramientas y ventajas para digitalizar tu negocio.",
      icon: Building,
    },
    {
      name: "Planes",
      href: "/planes",
      description:
        "Encuentra el plan perfecto para el crecimiento de tu comercio.",
      icon: CreditCard,
    },
    {
      name: "Preguntas Frecuentes",
      href: "/faq",
      description: "Respuestas a las dudas más comunes sobre nuestro servicio.",
      icon: HelpCircle,
    },
    {
      name: "Roadmap",
      href: "/roadmap",
      description:
        "Explora las próximas funcionalidades and mejoras que estamos preparando.",
      icon: MapIcon,
    },
  ],
  explorar: [
    {
      name: "Explorar Productos",
      href: "/explorar/productos",
      description:
        "Busca y encuentra una amplia variedad de productos locales.",
      icon: ShoppingBag,
    },
    {
      name: "Explorar Comercios",
      href: "/explorar/comercios",
      description: "Descubre las tiendas y negocios cerca de ti.",
      icon: Store,
    },
  ],
  comercio: [
    {
      name: "Registrar Comercio",
      href: "/auth/sign-up",
      description: "Únete a nuestra red y empieza a vender online hoy mismo.",
      icon: UserPlus,
    },
    {
      name: "Iniciar Sesión",
      href: "/auth/sign-in",
      description: "Accede a tu cuenta para gestionar tu actividad.",
      icon: LogIn,
    },
    {
      name: "Panel de Control",
      href: "/dashboard",
      description: "Administra tus productos, pedidos y estadísticas de venta.",
      icon: LayoutDashboard,
    },
  ],
  legal: [
    {
      name: "Política de Privacidad",
      href: "/privacidad",
      description: "Información sobre cómo tratamos y protegemos tus datos.",
      icon: ShieldCheck,
    },
    {
      name: "Términos y Condiciones",
      href: "/terminos",
      description: "Reglas y normas de uso de nuestra plataforma.",
      icon: FileText,
    },
    {
      name: "Política de Cookies",
      href: "/politica-de-cookies",
      description:
        "Detalles sobre el uso de cookies para mejorar tu experiencia.",
      icon: Cookie,
    },
  ],
};
