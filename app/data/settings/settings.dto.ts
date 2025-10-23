import { z } from "zod";

export const AccountUpdateSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export type AccountUpdateInput = z.infer<typeof AccountUpdateSchema>;
