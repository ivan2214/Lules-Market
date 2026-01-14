import { Elysia } from "elysia";
import { authPlugin } from "@/server/plugins/auth";
import { PaymentModel } from "./model";
import { PaymentService } from "./service";

export const paymentRouter = new Elysia({
  prefix: "/payment",
})
  .use(authPlugin)
  .get(
    "/plan",
    async ({ query }) => {
      return await PaymentService.getPlan(
        query.planType as "FREE" | "BASIC" | "PREMIUM",
      );
    },
    {
      query: PaymentModel.planTypeQuery,
    },
  )
  .post(
    "/createPreference",
    async ({ body, user }) => {
      return await PaymentService.createPreference(user.id, body.planType);
    },
    {
      isBusiness: true,
      body: PaymentModel.createPreferenceBody,
    },
  )
  .post(
    "/upgrade",
    async ({ body, user }) => {
      return await PaymentService.upgrade(user.id, body.plan);
    },
    {
      isBusiness: true,
      body: PaymentModel.upgradeBody,
    },
  )
  .post(
    "/cancel",
    async ({ user }) => {
      return await PaymentService.cancel(user.id);
    },
    {
      isBusiness: true,
    },
  )
  .get(
    "/history",
    async ({ user }) => {
      return await PaymentService.history(user.id);
    },
    {
      isBusiness: true,
    },
  )
  .post(
    "/startTrial",
    async ({ body, user }) => {
      return await PaymentService.startTrial(user.id, body.plan);
    },
    {
      isBusiness: true,
      body: PaymentModel.startTrialBody,
    },
  )
  .post(
    "/failure",
    async ({ body }) => {
      return await PaymentService.failure(body.paymentIdDB);
    },
    {
      isBusiness: true,
      body: PaymentModel.failureBody,
    },
  )
  .get(
    "/getPayment",
    async ({ query }) => {
      return await PaymentService.getPayment(query.paymentIdDB);
    },
    {
      isBusiness: true,
      query: PaymentModel.getPaymentQuery,
    },
  )
  .post(
    "/success",
    async ({ body }) => {
      return await PaymentService.success(body.paymentIdMP, body.paymentIdDB);
    },
    {
      isBusiness: true,
      body: PaymentModel.successBody,
    },
  );
