import type { PlanType } from "@/db/types";

export type PolicyUser = {
  userId: string;
  email: string;
  activePlan: PlanType;
};
