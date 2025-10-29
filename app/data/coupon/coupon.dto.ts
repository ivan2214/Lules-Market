import type {
  Coupon,
  CouponRedemption,
  SubscriptionPlan,
} from "@/app/generated/prisma";

export interface CouponDTO extends Coupon {
  plan: SubscriptionPlan;

  redemptions?: CouponRedemption[] | null;
}
