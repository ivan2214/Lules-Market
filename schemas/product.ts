import { z } from "zod";
import type { Prisma } from "@/app/generated/prisma";
import { CreateImageSchema } from "./images";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  images: CreateImageSchema.array().min(1, "Se requiere al menos una imagen"),
}) satisfies z.ZodType<
  Omit<Prisma.ProductCreateWithoutImagesInput, "business">
>;

export type CreateProductSchemaInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.extend({
  productId: z.string().min(1, "El ID del producto es requerido"),
}) satisfies z.ZodType<
  Omit<Prisma.ProductUpdateWithoutImagesInput, "business">
>;

export type UpdateProductSchemaInput = z.infer<typeof UpdateProductSchema>;

export const CreateOrUpdateProductSchema = z.discriminatedUnion("mode", [
  CreateProductSchema.extend({ mode: z.literal("create") }),
  UpdateProductSchema.extend({ mode: z.literal("update") }),
]);

export type CreateOrUpdateProductSchemaInput = z.infer<
  typeof CreateOrUpdateProductSchema
>;
