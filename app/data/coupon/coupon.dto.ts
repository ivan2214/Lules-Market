import type {
  Coupon,
  CouponRedemption,
  PlanType,
} from "@/app/generated/prisma/client";
import type { BusinessDTO } from "../business/business.dto";

export interface CouponDTO extends Coupon {
  plan: PlanType;

  redemptions?: CouponRedemption[] | null;
}

export interface CouponRedemptionDTO extends CouponRedemption {
  coupon: CouponDTO;
  business: BusinessDTO;
}
