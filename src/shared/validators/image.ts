import { z } from "zod";

export const ImageInputSchema = z.object({
  url: z
    .url("La URL de la imagen es inválida")
    .min(1, "La URL de la imagen es requerida"),
  key: z.string().min(1, "La llave de la imagen es requerida"),
  name: z.string(),
  isMainImage: z.boolean(),
  size: z.number(),
});
