import type { PlanType, Trial } from "@/app/generated/prisma";

export interface TrialDTO extends Trial {
  businessName: string;
  plan: PlanType;
  isActive: boolean;
}
