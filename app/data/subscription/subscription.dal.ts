import "server-only";

import {
  createPaymentPreference,
  getPayment,
} from "@/app/actions/payment-actions";
import {
  cancelSubscription,
  getSubscriptionHistory,
  upgradePlan,
} from "@/app/actions/subscription-actions";
import type { SubscriptionPlan } from "@/app/generated/prisma";
import { requireBusiness } from "../business/require-busines";
import type { PaymentDTO, PaymentPreferenceResult } from "./subscription.dto";

export class SubscriptionDAL {
  private constructor() {}

  static async create() {
    await requireBusiness();
    return new SubscriptionDAL();
  }

  async createPaymentPreference(
    plan: SubscriptionPlan,
  ): Promise<PaymentPreferenceResult> {
    // delegate to action which already enforces business
    return await createPaymentPreference(plan as SubscriptionPlan);
  }

  async processUpgrade(plan: string) {
    return await upgradePlan(plan as SubscriptionPlan);
  }

  async cancel() {
    return await cancelSubscription();
  }

  async getHistory() {
    return await getSubscriptionHistory();
  }

  async getPayment(paymentIdDB: string): Promise<PaymentDTO | null> {
    const res = await getPayment({ paymentIdDB });
    return res as unknown as PaymentDTO | null;
  }
}
