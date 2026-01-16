import { Elysia } from "elysia";
import { AppError } from "@/server/errors";
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
    async ({ body, isBusiness, business }) => {
      if (!isBusiness || !business)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await PaymentService.createPreference(business.id, body.planType);
    },
    {
      isBusiness: true,
      body: PaymentModel.createPreferenceBody,
    },
  )
  .post(
    "/upgrade",
    async ({ body, isBusiness, business }) => {
      if (!isBusiness || !business)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await PaymentService.upgrade(business.id, body.plan);
    },
    {
      isBusiness: true,
      body: PaymentModel.upgradeBody,
    },
  )
  .post(
    "/cancel",
    async ({ business, isBusiness }) => {
      if (!isBusiness || !business)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await PaymentService.cancel(business.id);
    },
    {
      isBusiness: true,
    },
  )
  .get(
    "/history",
    async ({ isBusiness, business }) => {
      if (!isBusiness || !business)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await PaymentService.history(business.id);
    },
    {
      isBusiness: true,
    },
  )
  .post(
    "/startTrial",
    async ({ body, isBusiness, business }) => {
      if (!isBusiness || !business)
        throw new AppError("Unauthorized", "UNAUTHORIZED");
      return await PaymentService.startTrial(business.id, body.plan);
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
