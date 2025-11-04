import z from "zod";
import type { Image } from "@/app/generated/prisma";

export type CleanImage = Omit<
  Image,
  | "productId"
  | "logoBusinessId"
  | "coverBusinessId"
  | "createdAt"
  | "updatedAt"
  | "isReported"
  | "isBanned"
>;
export const ImageCreateInputSchema = z.object({
  url: z.url("La URL de la imagen es inválida"),
  key: z.string().min(1, "La llave de la imagen es requerida"),
  name: z.string(),
  isMainImage: z.boolean(),
  size: z.number(),
});

export type ImageCreateInput = z.infer<typeof ImageCreateInputSchema>;

export const ImageUpdateInputSchema = ImageCreateInputSchema.extend({
  key: z.string().min(1, "La llave de la imagen es requerida"),
});
export type ImageUpdateInput = z.infer<typeof ImageUpdateInputSchema>;
