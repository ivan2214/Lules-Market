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
// BUSINESS SCHEMAS
// ==========================================

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

export const BusinessUpdateSchema = BusinessSetupSchema.extend({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("El email es requerido"),
});

// ==========================================
// PRODUCT SCHEMAS
// ==========================================

export const ProductCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  category: z.string().min(1, "La categoría es requerida"),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  images: z.array(ImageInputSchema).min(1, "Se requiere al menos una imagen"),
});

export const ProductUpdateSchema = ProductCreateSchema.extend({
  productId: z.string().min(1, "El ID del producto es requerido").optional(),
});

export const ProductDeleteSchema = z.object({
  productId: z.string().min(1, "El ID del producto es requerido"),
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
export type BusinessSetupInput = z.infer<typeof BusinessSetupSchema>;
export type BusinessUpdateInput = z.infer<typeof BusinessUpdateSchema>;
export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
export type ProductDeleteInput = z.infer<typeof ProductDeleteSchema>;
export type AccountUpdateInput = z.infer<typeof AccountUpdateSchema>;
export type LogInsertInput = z.infer<typeof LogInsertSchema>;
