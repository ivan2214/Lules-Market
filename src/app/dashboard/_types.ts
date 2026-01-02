import type z from "zod";
import type {
  ProductCreateSchema,
  ProductUpdateSchema,
} from "@/shared/validators/product";
import type { subscriptionErrors } from "./_constants";

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;

export type SubscriptionErrorType =
  | "subscription_required"
  | "subscription_expired"
  | "subscription_limit_reached";
export type SubscriptionErrorConfig = {
  title: string;
  description: string;
  variant: "default" | "warning" | "destructive";
};
export type SubscriptionError = keyof typeof subscriptionErrors;
