import { z } from "zod";

import type {
  BannedProduct,
  Image,
  Product as ProductPrisma,
  productView,
} from "@/app/generated/prisma";
import type { BusinessDTO } from "../business/business.dto";
import { ImageCreateInputSchema } from "../image/image.dto";

export const ProductCreateInputSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  // opcional string o undefined o null
  category: z.string().min(1, "La categoría es requerida").optional().nullish(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  images: ImageCreateInputSchema.array().min(
    1,
    "Se requiere al menos una imagen",
  ),
});

export type ProductCreateInput = z.infer<typeof ProductCreateInputSchema>;

export const ProductUpdateInputSchema = ProductCreateInputSchema.extend({
  productId: z.string().min(1, "El ID del producto es requerido").optional(),
});

export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;

export const ProductDeleteInputSchema = z.object({
  productId: z.string().min(1, "El ID del producto es requerido"),
});

export type ProductDeleteInput = z.infer<typeof ProductDeleteInputSchema>;

export interface ProductDTO extends ProductPrisma {
  images: Image[];
  views?: productView[] | null;
  business?: BusinessDTO | null;
  bannedProduct?: BannedProduct | null;
}
