import { z } from "zod";
import type {
  BannedBusiness,
  Business as BusinessPrisma,
  CurrentPlan,
  Plan,
} from "@/app/generated/prisma";
import type { AnswerDTO } from "../answer/answer.dto";
import type { CategoryDTO } from "../category/category.dto";
import { type CleanImage, ImageCreateInputSchema } from "../image/image.dto";
import type { ProductDTO } from "../product/product.dto";
import type { ReviewDTO } from "../review/review.dto";
import type { UserDTO } from "../user/user.dto";

export const BusinessSetupInputSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().min(1, "La descripción es requerida"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().optional(),
  website: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  logo: ImageCreateInputSchema,
  coverImage: ImageCreateInputSchema,
});
export type BusinessSetupInput = z.infer<typeof BusinessSetupInputSchema>;

export const BusinessUpdateInputSchema = BusinessSetupInputSchema.extend({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El email es requerido"),
});

export type BusinessUpdateInput = z.infer<typeof BusinessUpdateInputSchema>;

export interface BusinessDTO extends BusinessPrisma {
  logo?: CleanImage | null;
  coverImage?: CleanImage | null;
  products?: ProductDTO[] | null;
  user?: UserDTO | null;
  bannedBusiness?: BannedBusiness | null;
  category?: CategoryDTO | null;
  reviews?: ReviewDTO[] | null;
  answers?: AnswerDTO[] | null;
  currentPlan?: CurrentPlanDTO | null;
}


export interface CurrentPlanDTO extends CurrentPlan {
  business: BusinessDTO
  plan: PlanDTO
}

export interface PlanDTO extends Plan {
  currentPlans: CurrentPlanDTO[]
}


