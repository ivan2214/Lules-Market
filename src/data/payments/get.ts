import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { PaymentService } from "@/server/modules/payment/service";
import { getCurrentSession } from "../session/get-current-session";

export async function getPaymentHistory() {
  const { user } = await getCurrentSession();

  if (!user) {
    return [];
  }

  // Payments are specific to the user/business, might not want to cache globally with "use cache"
  // unless we use user-specific tags, or just rely on the service's internal caching.
  // For now, let's just call the service directly.

  return await PaymentService.history(user.id);
}

export async function getPaymentPlan(planType: "FREE" | "BASIC" | "PREMIUM") {
  "use cache";
  cacheTag("plans", `plan-${planType}`);
  cacheLife("weeks");

  return await PaymentService.getPlan(planType);
}

export async function getPaymentById(paymentId: string) {
  // Payment info is sensitive, might not want to cache globally or use strictly user-specific cache
  return await PaymentService.getPayment(paymentId);
}
