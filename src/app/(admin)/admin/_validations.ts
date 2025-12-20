import z from "zod";
import type { PlanInsert, PlanType } from "@/db/types";

export const BannedBusinessInputSchema = z.object({
  businessId: z.string(),
});

export const ChangePlanInputSchema = z.object({
  businessId: z.string(),
  planType: z.enum(["FREE", "BASIC", "PREMIUM"]),
  isTrial: z.boolean().optional().default(false),
  trialDays: z.number().optional().default(30),
  planDurationDays: z.number().optional().default(30),
});

export const PlanFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  type: z.enum(["FREE", "BASIC", "PREMIUM"] as PlanType[]),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  discount: z.coerce
    .number()
    .min(0, "El descuento debe ser mayor o igual a 0")
    .optional(),
  maxProducts: z.coerce
    .number()
    .min(0, "El número máximo de productos debe ser mayor o igual a 0"),
  maxImagesPerProduct: z.coerce
    .number()
    .min(
      0,
      "El número máximo de imágenes por producto debe ser mayor o igual a 0",
    ),
  features: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos una característica"),
  details: z.object({
    products: z.string(),
    images: z.string(),
    priority: z.string(),
  }),
  popular: z.boolean().default(false).optional(),
  hasStatistics: z.boolean().optional(),
  canFeatureProducts: z.boolean().optional(),
  isActive: z.boolean().optional(),
}) satisfies z.ZodType<PlanInsert>;
