import { MessageSquare, ShoppingBag, Store } from "lucide-react";
import type { PlanType } from "@/app/generated/prisma";

export const PLAN_PRICES: Record<PlanType, number> = {
  FREE: 0,
  BASIC: 15000,
  PREMIUM: 20000,
};

export const PLAN_NAMES: Record<PlanType, string> = {
  FREE: "Gratuito",
  BASIC: "Básico",
  PREMIUM: "Premium",
};

export const CATEGORIES = [
  "Alimentos y Bebidas",
  "Ropa y Accesorios",
  "Electrónica",
  "Hogar y Jardín",
  "Salud y Belleza",
  "Deportes",
  "Juguetes",
  "Libros",
  "Servicios",
  "Otros",
] as const;

export const PLAN_FEATURES = {
  FREE: [
    "Hasta 5 productos",
    "Perfil básico de negocio",
    "Información de contacto",
    "Enlaces a redes sociales",
  ],
  BASIC: [
    "Hasta 20 productos",
    "Perfil completo de negocio",
    "Estadísticas básicas",
    "Información de contacto",
    "Enlaces a redes sociales",
    "Soporte por email",
  ],
  PREMIUM: [
    "Productos ilimitados",
    "Perfil destacado",
    "Estadísticas avanzadas",
    "Productos destacados",
    "Prioridad en búsquedas",
    "Información de contacto",
    "Enlaces a redes sociales",
    "Soporte prioritario",
  ],
};

export const CONTACT_TYPES = {
  whatsapp: "WhatsApp",
  phone: "Teléfono",
  email: "Email",
  website: "Sitio Web",
  facebook: "Facebook",
  instagram: "Instagram",
} as const;

export const navigation = [
  { name: "Inicio", href: "/", icon: Store },
  { name: "Productos", href: "/explorar/productos", icon: ShoppingBag },
  { name: "Opiniones", href: "/explorar/opiniones", icon: MessageSquare },
  { name: "Comercios", href: "/explorar/comercios", icon: Store },
];
