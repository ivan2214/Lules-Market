import type z from "zod";
import type { subscriptionErrors } from "./_constants";
import type { ProductCreateSchema, ProductUpdateSchema } from "./_validations";

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
