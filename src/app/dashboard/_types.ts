import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@/shared/validators/product";
import type { subscriptionErrors } from "./_constants";

export type { ProductCreateInput, ProductUpdateInput };

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
