import { ShoppingBag, Store } from "lucide-react";

export const CATEGORIES = [
  "Alimentos",
  "Bebidas",
  "Ropa",
  "Electrónica",
  "Hogar",
  "Salud",
  "Belleza",
  "Deportes",
  "Juguetes",
  "Mascotas",
  "Otros",
] as const;

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
  { name: "Comercios", href: "/explorar/comercios", icon: Store },
];
