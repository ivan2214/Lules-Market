import { t } from "elysia";
import { ImageInputSchema } from "@/shared/validators/image";

export const BusinessSetupSchema = t.Object({
  userEmail: t.String(),
  name: t.String().min(1, "El nombre es requerido"),
  category: t.String().optional(),
  description: t.String().optional(),
  address: t.String().optional(),
  phone: t.String().optional(),
  website: t.String().optional(),
  whatsapp: t.String().optional(),
  facebook: t.String().optional(),
  instagram: t.String().optional(),
  logo: ImageInputSchema,
  coverImage: ImageInputSchema,
  tags: t.Array(t.String()).optional(),
});

export const BusinessUpdateSchema = BusinessSetupSchema.extend({
  name: t.String().min(1, "El nombre es requerido"),
  email: t.String().email("El email es requerido"),
});
