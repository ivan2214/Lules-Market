import Elysia, { t } from "elysia";
import { authPlugin } from "../plugins/auth";
import {
  cancelService,
  createPreferenceService,
  failureService,
  getPaymentService,
  getPlanService,
  historyService,
  startTrialService,
  successService,
  upgradeService,
} from "../services/payment";

const PlanTypeSchema = t.Union([
  t.Literal("FREE"),
  t.Literal("BASIC"),
  t.Literal("PREMIUM"),
]);

export const paymentRouter = new Elysia({
  prefix: "/payment",
})
  .use(authPlugin)
  .get(
    "/plan",
    async ({ query }) => {
      // Explicitly cast to the union type because TypeScript inference might be too loose for the service
      return await getPlanService(
        query.planType as "FREE" | "BASIC" | "PREMIUM",
      );
    },
    {
      query: t.Object({
        planType: PlanTypeSchema,
      }),
    },
  )
  .post(
    "/createPreference",
    async ({ body, user }) => {
      return await createPreferenceService(user.id, body.planType);
    },
    {
      isBusiness: true,
      body: t.Object({
        planType: PlanTypeSchema,
      }),
    },
  )
  .post(
    "/upgrade",
    async ({ body, user }) => {
      return await upgradeService(user.id, body.plan);
    },
    {
      isBusiness: true,
      body: t.Object({
        plan: PlanTypeSchema,
      }),
    },
  )
  .post(
    "/cancel",
    async ({ user }) => {
      return await cancelService(user.id);
    },
    {
      isBusiness: true,
    },
  )
  .get(
    "/history",
    async ({ user }) => {
      return await historyService(user.id);
    },
    {
      isBusiness: true,
    },
  )
  .post(
    "/startTrial",
    async ({ body, user }) => {
      return await startTrialService(user.id, body.plan);
    },
    {
      isBusiness: true,
      body: t.Object({
        plan: t.Optional(PlanTypeSchema), // Service defaults to PREMIUM if undefined
      }),
    },
  )
  .post(
    "/failure",
    async ({ body }) => {
      return await failureService(body.paymentIdDB);
    },
    {
      isBusiness: true,
      body: t.Object({
        paymentIdDB: t.String(),
      }),
    },
  )
  .get(
    "/getPayment",
    async ({ query }) => {
      return await getPaymentService(query.paymentIdDB);
    },
    {
      isBusiness: true,
      query: t.Object({
        paymentIdDB: t.String(),
      }),
    },
  )
  .post(
    "/success",
    async ({ body }) => {
      return await successService(body.paymentIdMP, body.paymentIdDB);
    },
    {
      isBusiness: true,
      body: t.Object({
        paymentIdMP: t.String(),
        paymentIdDB: t.String(),
      }),
    },
  );
