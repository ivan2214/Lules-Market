import { z } from "zod";

export const resendEmailSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
});

export type ResendEmailSchema = z.infer<typeof resendEmailSchema>;

export const tokenSchema = z.object({
  token: z
    .string()
    .min(6, "El token debe tener al menos 6 caracteres")
    .max(100, "El token es demasiado largo"),
});

export type TokenSchema = z.infer<typeof tokenSchema>;
