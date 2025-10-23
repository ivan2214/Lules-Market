import { z } from "zod";

import type {
  Image,
  Prisma,
  Product as ProductPrisma,
  productView,
} from "@/app/generated/prisma";
import type { BusinessDTO } from "../business/business.dto";

export const ImageCreateInputSchema = z.object({
  url: z.string().url("La URL de la imagen es inválida"),
  key: z.string().min(1, "La llave de la imagen es requerida"),
  name: z.string().min(1, "El nombre de la imagen es requerido").optional(),
  isMainImage: z.boolean(),
  size: z
    .number()
    .min(0, "El tamaño de la imagen debe ser mayor o igual a 0")
    .optional(),
}) satisfies z.Schema<Prisma.ImageCreateInput>;

export type ImageCreateInput = z.infer<typeof ImageCreateInputSchema>;

export const ImageUpdateInputSchema = ImageCreateInputSchema.extend({
  key: z.string().min(1, "La llave de la imagen es requerida"),
}) satisfies z.Schema<Prisma.ImageUpdateInput>;
export type ImageUpdateInput = z.infer<typeof ImageUpdateInputSchema>;

export const ProductCreateInputSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  images: ImageCreateInputSchema.array().min(
    1,
    "Se requiere al menos una imagen",
  ),
}) satisfies z.ZodType<
  Omit<Prisma.ProductCreateWithoutImagesInput, "business">
>;

export type ProductCreateInput = z.infer<typeof ProductCreateInputSchema>;

export const ProductUpdateInputSchema = ProductCreateInputSchema.extend({
  productId: z.string().min(1, "El ID del producto es requerido"),
}) satisfies z.ZodType<
  Omit<Prisma.ProductUpdateWithoutImagesInput, "business">
>;

export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;

export const ProductCreateOrUpdateSchema = z.discriminatedUnion("mode", [
  ProductCreateInputSchema.extend({ mode: z.literal("create") }),
  ProductUpdateInputSchema.extend({ mode: z.literal("update") }),
]);

export type ProductCreateOrUpdateInput = z.infer<
  typeof ProductCreateOrUpdateSchema
>;

export const ProductDeleteInputSchema = z.object({
  productId: z.string().min(1, "El ID del producto es requerido"),
}) satisfies z.ZodType<{ productId: string }>;

export type ProductDeleteInput = z.infer<typeof ProductDeleteInputSchema>;

export interface ProductDTO extends ProductPrisma {
  images?: Image[] | null;
  views?: productView[] | null;
  business?: BusinessDTO | null;
}
