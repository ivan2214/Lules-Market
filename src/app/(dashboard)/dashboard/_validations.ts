import z from "zod";
import { ImageInputSchema } from "@/core/router/schemas";

export const ProductCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  active: z.boolean().optional(),
  images: z.array(ImageInputSchema).min(1, "Se requiere al menos una imagen"),
});

export const ProductUpdateSchema = ProductCreateSchema.extend({
  productId: z.string().min(1, "El ID del producto es requerido").optional(),
});

export const ProductDeleteSchema = z.object({
  productId: z.string().min(1, "El ID del producto es requerido"),
});
