import { z } from "zod";
import type {
  Business as BusinessPrisma,
  Image,
  Prisma,
  SubscriptionPlan,
} from "@/app/generated/prisma";
import type { ProductDTO } from "../product/product.dto";

export const BusinessCreateInputSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  website: z.string().url("URL inválida").optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  address: z.string().optional(),
  logo: z.any().optional(),
  coverImage: z.any().optional(),
}) satisfies z.ZodType<Partial<Prisma.BusinessCreateInput>>;

export type BusinessCreateInput = z.infer<typeof BusinessCreateInputSchema>;

export const BusinessUpdateInputSchema = BusinessCreateInputSchema.extend({
  // para update no se requiere nada extra en la forma básica
  id: z.string().min(1, "El ID del negocio es requerido").optional(),
});

export type BusinessUpdateInput = z.infer<typeof BusinessUpdateInputSchema>;

export interface BusinessDTO extends BusinessPrisma {
  logo?: Image | null;
  coverImage?: Image | null;
  plan: SubscriptionPlan;
  products?: ProductDTO[] | null;
}

export type BusinessProductDTO = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  images: Image[];
  active: boolean;
  featured: boolean;
};
