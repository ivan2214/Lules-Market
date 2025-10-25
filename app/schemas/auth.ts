import z from "zod";

export const BusinessSignInInputSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type BusinessSignInInput = z.infer<typeof BusinessSignInInputSchema>;
