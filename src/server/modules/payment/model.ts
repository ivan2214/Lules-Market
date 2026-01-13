import { t } from "elysia";

export namespace PaymentModel {
  export const PlanTypeUnion = t.Union([
    t.Literal("FREE"),
    t.Literal("BASIC"),
    t.Literal("PREMIUM"),
  ]);

  export const planTypeQuery = t.Object({
    planType: PlanTypeUnion,
  });

  export const createPreferenceBody = t.Object({
    planType: PlanTypeUnion,
  });

  export const upgradeBody = t.Object({
    plan: PlanTypeUnion,
  });

  export const startTrialBody = t.Object({
    plan: t.Optional(PlanTypeUnion),
  });

  export const failureBody = t.Object({
    paymentIdDB: t.String(),
  });

  export const getPaymentQuery = t.Object({
    paymentIdDB: t.String(),
  });

  export const successBody = t.Object({
    paymentIdMP: t.String(),
    paymentIdDB: t.String(),
  });
}
