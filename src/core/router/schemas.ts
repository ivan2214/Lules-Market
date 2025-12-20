import { z } from "zod";
import type { LogInsert } from "@/db/types";

// ==========================================
// SHARED SCHEMAS
// ==========================================

export const ImageInputSchema = z.object({
  url: z.string().url("La URL de la imagen es inválida"),
  key: z.string().min(1, "La llave de la imagen es requerida"),
  name: z.string(),
  isMainImage: z.boolean(),
  size: z.number(),
});

// ==========================================
// SETTINGS SCHEMAS
// ==========================================

export const AccountUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

// ==========================================
// ADMIN SCHEMAS
// ==========================================

export const LogInsertSchema = z.object({
  businessId: z.string().optional(),
  adminId: z.string().optional(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  details: z.unknown().optional(),
}) satisfies z.ZodType<LogInsert>;

// ==========================================
// TYPES
// ==========================================

export type ImageInput = z.infer<typeof ImageInputSchema>;
export type AccountUpdateInput = z.infer<typeof AccountUpdateSchema>;
export type LogInsertInput = z.infer<typeof LogInsertSchema>;
