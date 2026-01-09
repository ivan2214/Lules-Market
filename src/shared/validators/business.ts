import z from "zod";
import { ImageInputSchema } from "@/shared/validators/image";

export const BusinessSetupSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  category: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  logo: ImageInputSchema,
  coverImage: ImageInputSchema,
  tags: z.array(z.string()).optional(),
});

export const BusinessUpdateSchema = BusinessSetupSchema.extend({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El email es requerido"),
});
