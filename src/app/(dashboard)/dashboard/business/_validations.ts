import z from "zod";
import { BusinessSetupSchema } from "@/app/(auth)/_validations";

export const BusinessUpdateSchema = BusinessSetupSchema.extend({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El email es requerido"),
});
