import z from "zod";
import type { Prisma } from "@/app/generated/prisma";

export const CreateImageSchema = z.object({
  url: z.string().url("La URL de la imagen es inválida"),
  key: z.string().min(1, "La llave de la imagen es requerida"),
  name: z.string().min(1, "El nombre de la imagen es requerido").optional(),
  isMainImage: z.boolean().optional(),
  size: z
    .number()
    .min(0, "El tamaño de la imagen debe ser mayor o igual a 0")
    .optional(),
}) satisfies z.Schema<Prisma.ImageCreateInput>;

export type CreateImageSchemaInput = z.infer<typeof CreateImageSchema>;

export const UpdateImageSchema = CreateImageSchema.extend({
  key: z.string().min(1, "La llave de la imagen es requerida"),
}) satisfies z.Schema<Prisma.ImageUpdateInput>;
export type UpdateImageSchemaInput = z.infer<typeof UpdateImageSchema>;
