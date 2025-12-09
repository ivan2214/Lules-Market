import type { PlanType, Trial } from "@/db";

export interface TrialDTO extends Trial {
  businessName: string;
  plan: PlanType;
  isActive: boolean;
}
