import { z } from "zod";
import {
  type Image,
  type Prisma,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/app/generated/prisma";

export const BusinessCreateInputSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  website: z.string().url("URL inválida").optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  address: z.string().optional(),
  logo: z.any().optional(),
  coverImage: z.any().optional(),
}) satisfies z.ZodType<Partial<Prisma.BusinessCreateInput>>;

export type BusinessCreateInput = z.infer<typeof BusinessCreateInputSchema>;

export const BusinessUpdateInputSchema = BusinessCreateInputSchema.extend({
  // para update no se requiere nada extra en la forma básica
  id: z.string().min(1, "El ID del negocio es requerido").optional(),
});

export type BusinessUpdateInput = z.infer<typeof BusinessUpdateInputSchema>;

export const BusinessSchema = z.object({
  id: z.string().nullish(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  phone: z.string().nullish(),
  whatsapp: z.string().nullish(),
  email: z.string().nullish(),
  website: z.string().nullish(),
  facebook: z.string().nullish(),
  instagram: z.string().nullish(),
  twitter: z.string().nullish(),
  address: z.string().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  products: z.number(),
  plan: z
    .enum([
      SubscriptionPlan.FREE,
      SubscriptionPlan.PREMIUM,
      SubscriptionPlan.BASIC,
    ])
    .nullish(),
  planExpiresAt: z.date().nullish(),
  planStatus: z
    .enum([
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.INACTIVE,
      SubscriptionStatus.CANCELLED,
      SubscriptionStatus.EXPIRED,
    ])
    .nullish(),
  logo: z.string().nullish(),
  coverImage: z.string().nullish(),
  category: z.string().nullish(),
  hours: z.string().nullish(),
});

export type BusinessDTO = z.infer<typeof BusinessSchema>;

export type BusinessProductDTO = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  images: Image[];
  active: boolean;
  featured: boolean;
};
