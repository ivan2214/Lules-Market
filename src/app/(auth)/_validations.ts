import z from "zod";
import { ImageInputSchema } from "@/core/router/schemas";

export const BusinessSignInInputSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const BusinessSignUpInputSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.email("Email inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const BusinessSetupSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().min(1, "La descripción es requerida"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().optional(),
  website: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  logo: ImageInputSchema.optional(),
  coverImage: ImageInputSchema.optional(),
  tags: z.array(z.string()).optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});
