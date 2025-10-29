"use server";

import * as SubscriptionDAL from "../data/payment/payment.dal";

export async function processPaymentSuccess({
  paymentIdMP,
  paymentIdDB,
}: {
  paymentIdMP: string;
  paymentIdDB: string;
}) {
  return SubscriptionDAL.processPaymentSuccess({ paymentIdMP, paymentIdDB });
}

export async function processPaymentFailure({
  paymentIdDB,
}: {
  paymentIdDB: string;
}) {
  return SubscriptionDAL.processPaymentFailure({ paymentIdDB });
}

export async function getPayment({ paymentIdDB }: { paymentIdDB: string }) {
  return SubscriptionDAL.getPayment({ paymentIdDB });
}
