import { z } from "zod";
import type { Prisma } from "@/app/generated/prisma";

export const ImageCreateInputSchema = z.object({
  url: z.string().url("La URL de la imagen es inválida"),
  key: z.string().min(1, "La llave de la imagen es requerida"),
  name: z.string().min(1, "El nombre de la imagen es requerido").optional(),
  isMainImage: z.boolean().optional(),
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
    "Se requiere al menos una imagen"
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

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullish(),
  price: z.number().nullish(),
  category: z.string().nullish(),
  featured: z.boolean(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProductDTO = z.infer<typeof ProductSchema>;
