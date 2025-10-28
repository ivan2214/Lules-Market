import { z } from "zod";
import type {
  Business as BusinessPrisma,
  SubscriptionPlan,
} from "@/app/generated/prisma";
import { type CleanImage, ImageCreateInputSchema } from "../image/image.dto";
import type { ProductDTO } from "../product/product.dto";

export const BusinessCreateInputSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email("Email inválido").nullable(),
  website: z.string().url("URL inválida").nullable(),
  hours: z.string().nullable(),
  whatsapp: z.string().nullable(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  logo: ImageCreateInputSchema,
  coverImage: ImageCreateInputSchema,
});
export type BusinessCreateInput = z.infer<typeof BusinessCreateInputSchema>;

export const BusinessUpdateInputSchema = BusinessCreateInputSchema.extend({
  // para update no se requiere nada extra en la forma básica
  id: z.string().min(1, "El ID del negocio es requerido").optional(),
});

export type BusinessUpdateInput = z.infer<typeof BusinessUpdateInputSchema>;

export interface BusinessDTO extends BusinessPrisma {
  logo?: CleanImage | null;
  coverImage?: CleanImage | null;
  plan: SubscriptionPlan;
  products?: ProductDTO[] | null;
}
