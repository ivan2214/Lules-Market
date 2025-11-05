import { z } from "zod";
import type {
  BannedBusiness,
  Business as BusinessPrisma,
} from "@/app/generated/prisma";
import { type CleanImage, ImageCreateInputSchema } from "../image/image.dto";
import type { ProductDTO } from "../product/product.dto";
import type { UserDTO } from "../user/user.dto";

export const BusinessCreateInputSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().min(1, "La descripción es requerida"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  logo: ImageCreateInputSchema,
  coverImage: ImageCreateInputSchema,
});
export type BusinessCreateInput = z.infer<typeof BusinessCreateInputSchema>;

export const BusinessUpdateInputSchema = BusinessCreateInputSchema;

export type BusinessUpdateInput = z.infer<typeof BusinessUpdateInputSchema>;

export interface BusinessDTO extends BusinessPrisma {
  logo?: CleanImage | null;
  coverImage?: CleanImage | null;
  products?: ProductDTO[] | null;
  user?: UserDTO | null;
  bannedBusiness?: BannedBusiness | null;
}
