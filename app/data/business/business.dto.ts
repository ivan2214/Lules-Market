import { z } from "zod";
import type { BusinessWithRelations } from "@/db/types";
import { ImageCreateInputSchema } from "../image/image.dto";

export const BusinessSetupInputSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().min(1, "La descripción es requerida"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().optional(),
  website: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  logo: ImageCreateInputSchema,
  coverImage: ImageCreateInputSchema,
  tags: z.array(z.string()).optional(),
});
export type BusinessSetupInput = z.infer<typeof BusinessSetupInputSchema>;

export const BusinessUpdateInputSchema = BusinessSetupInputSchema.extend({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El email es requerido"),
});

export type BusinessUpdateInput = z.infer<typeof BusinessUpdateInputSchema>;

export type BusinessDTO = BusinessWithRelations;
