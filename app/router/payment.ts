import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { z } from "zod";
import { type CurrentPlan, db, type PaymentWithRelations, schema } from "@/db";
import { env } from "@/env";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { paymentClient, preferenceClient } from "@/lib/mercadopago";
import { getPlan } from "../data/plan/plan.dal";
import { businessAuthorized } from "./middlewares/authorized";

const invalidateBusiness = (businessId: string) => {
  updateTag(CACHE_TAGS.BUSINESS.GET_BY_ID(businessId));
  updateTag(CACHE_TAGS.BUSINESS.GET_ALL);
};

const PlanTypeSchema = z.enum(["FREE", "BASIC", "PREMIUM"]);

export const createPreference = businessAuthorized
  .route({
    method: "POST",
    description: "Create a Mercado Pago preference",
    summary: "Create a Mercado Pago preference",
    tags: ["Payment"],
  })
  .input(
    z.object({
      planType: PlanTypeSchema,
    }),
  )
  .output(
    z.object({
      preferenceId: z.string().nullish(),
      initPoint: z.string().nullish(),
      sandboxInitPoint: z.string().nullish(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { business: currentBusiness } = context;
    const { planType } = input;

    if (planType === "FREE") {
      return {
        preferenceId: null,
        initPoint: null,
        sandboxInitPoint: null,
      };
    }

    const planLimits = await getPlan(planType);

    if (!planLimits) {
      return {
        preferenceId: null,
        initPoint: null,
        sandboxInitPoint: null,
      };
    }

    // Create payment record
    const [payment] = await db
      .insert(schema.payment)
      .values({
        amount: planLimits.price,
        currency: "ARS",
        status: "pending",
        plan: planType,
        businessId: currentBusiness.id,
      })
      .returning();

    // Create Mercado Pago preference
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: payment.id,
            title: `Plan ${planType} - Comercios Locales`,
            description: `Suscripción mensual al plan ${planType}`,
            quantity: 1,
            unit_price: 1 || planLimits.price,
            currency_id: "ARS",
          },
        ],
        metadata: {
          businessId: currentBusiness.id,
          paymentId: payment.id,
        },
        back_urls: {
          success: `${env.APP_URL}/dashboard/subscription/success`,
          failure: `${env.APP_URL}/dashboard/subscription/failure`,
          pending: `${env.APP_URL}/dashboard/subscription/pending`,
        },
        external_reference: payment.id,
        notification_url: `${env.APP_URL}/api/webhooks/mercadopago`,
        statement_descriptor: "COMERCIOS LOCALES",
        expiration_date_from: undefined,
      },
    });

    // Update payment with preference ID
    await db
      .update(schema.payment)
      .set({ mpPaymentId: preference.id })
      .where(eq(schema.payment.id, payment.id));

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    };
  });

export const upgrade = businessAuthorized
  .route({
    method: "POST",
    description: "Upgrade to a plan",
    summary: "Upgrade to a plan",
    tags: ["Payment"],
  })
  .input(
    z.object({
      plan: PlanTypeSchema,
    }),
  )
  .output(
    z.object({
      updated: z.custom<CurrentPlan>().optional(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { business: currentBusiness } = context;
    const { plan } = input;

    if (currentBusiness?.currentPlan?.planType === plan) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Ya tienes este plan activo",
      });
    }

    const [updated] = await db
      .update(schema.currentPlan)
      .set({
        planType: plan,
        planStatus: "ACTIVE",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      })
      .where(eq(schema.currentPlan.id, currentBusiness.id))
      .returning();

    invalidateBusiness(currentBusiness.id);

    return { updated };
  });

export const cancel = businessAuthorized
  .route({
    method: "POST",
    description: "Cancel a plan",
    summary: "Cancel a plan",
    tags: ["Payment"],
  })
  .handler(async ({ context }) => {
    const { business: currentBusiness } = context;

    if (currentBusiness?.currentPlan?.planType === "FREE") {
      throw new ORPCError("BAD_REQUEST", {
        message: "No tienes una suscripción activa",
      });
    }

    const [updated] = await db
      .update(schema.currentPlan)
      .set({
        planStatus: "CANCELLED",
        expiresAt: new Date(),
      })
      .where(eq(schema.currentPlan.id, currentBusiness.id))
      .returning();

    invalidateBusiness(currentBusiness.id);

    return updated;
  });

export const history = businessAuthorized
  .route({
    method: "GET",
    description: "Get payment history",
    summary: "Get payment history",
    tags: ["Payment"],
  })
  .handler(async ({ context }) => {
    const { business: currentBusiness } = context;

    const payments = await db.query.payment.findMany({
      where: eq(schema.payment.businessId, currentBusiness.id),
      orderBy: (payment, { desc }) => [desc(payment.createdAt)],
    });

    return payments;
  });

export const startTrial = businessAuthorized
  .route({
    method: "POST",
    description: "Start a trial",
    summary: "Start a trial",
    tags: ["Payment"],
  })
  .input(
    z.object({
      plan: PlanTypeSchema.default("PREMIUM"),
    }),
  )
  .handler(async ({ context, input }) => {
    const { business: currentBusiness } = context;
    const { plan } = input;

    const existingTrial = await db.query.trial.findFirst({
      where: eq(schema.trial.businessId, currentBusiness.id),
    });

    if (existingTrial?.isActive) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Ya tenés un trial activo.",
      });
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    await db.insert(schema.trial).values({
      businessId: currentBusiness.id,
      plan,
      expiresAt,
    });

    await db
      .update(schema.currentPlan)
      .set({
        planType: plan,
        planStatus: "ACTIVE",
        expiresAt: expiresAt,
      })
      .where(eq(schema.currentPlan.id, currentBusiness.id));

    // Registrar en analíticas
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existingAnalytics = await db.query.analytics.findFirst({
      where: eq(schema.analytics.date, today),
    });

    if (existingAnalytics) {
      await db
        .update(schema.analytics)
        .set({
          totalTrials: (existingAnalytics.totalTrials ?? 0) + 1,
          activeTrials: (existingAnalytics.activeTrials ?? 0) + 1,
        })
        .where(eq(schema.analytics.date, today));
    } else {
      await db.insert(schema.analytics).values({
        date: today,
        totalTrials: 1,
        activeTrials: 1,
      });
    }

    invalidateBusiness(currentBusiness.id);

    return { message: "Trial iniciado con éxito", expiresAt };
  });

export const failure = businessAuthorized
  .route({
    method: "POST",
    description: "Handle payment failure",
    summary: "Handle payment failure",
    tags: ["Payment"],
  })
  .input(
    z.object({
      paymentIdDB: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { business: _currentBusiness } = context;
    const { paymentIdDB } = input;

    const payment = await db.query.payment.findFirst({
      where: eq(schema.payment.id, paymentIdDB),
    });

    if (!payment) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Pago no encontrado",
      });
    }

    await db
      .update(schema.payment)
      .set({
        status: "rejected",
        mpStatus: "rejected",
      })
      .where(eq(schema.payment.id, paymentIdDB));
  });

export const getPayment = businessAuthorized
  .route({
    method: "GET",
    description: "Get payment",
    summary: "Get payment",
    tags: ["Payment"],
  })
  .input(
    z.object({
      paymentIdDB: z.string(),
    }),
  )
  .output(
    z.object({
      payment: z.custom<PaymentWithRelations>().optional(),
    }),
  )
  .handler(async ({ context, input }) => {
    try {
      const { business: _currentBusiness } = context;
      const { paymentIdDB } = input;
      const payment = await db.query.payment.findFirst({
        where: eq(schema.payment.id, paymentIdDB),
        with: { business: true },
      });

      return { payment: payment ? payment : undefined };
    } catch (error) {
      console.error("Error getting payment:", error);
      throw error;
    }
  });

export const success = businessAuthorized
  .route({
    method: "POST",
    description: "Handle payment success",
    summary: "Handle payment success",
    tags: ["Payment"],
  })
  .input(
    z.object({
      paymentIdMP: z.string(),
      paymentIdDB: z.string(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { business: _currentBusiness } = context;
    const { paymentIdMP, paymentIdDB } = input;
    try {
      const mpPayment = await paymentClient.get({
        id: paymentIdMP,
      });

      if (!mpPayment) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Pago no encontrado en Mercado Pago",
        });
      }

      const status = mpPayment.status;

      if (status !== "approved") {
        await db
          .update(schema.payment)
          .set({
            status: "rejected",
            mpStatus: status,
          })
          .where(eq(schema.payment.id, paymentIdDB));
        return null;
      }

      const payment = await db.query.payment.findFirst({
        where: eq(schema.payment.id, paymentIdDB),
        with: { business: true },
      });

      if (!payment) {
        throw new ORPCError("BAD_REQUEST", {
          message: "Pago no encontrado",
        });
      }

      // Update payment status
      await db
        .update(schema.payment)
        .set({
          status: "approved",
          mpStatus: status,
          paymentMethod: mpPayment.payment_method_id,
          amount: mpPayment.transaction_amount,
          currency: mpPayment.currency_id,
        })
        .where(eq(schema.payment.id, paymentIdDB));

      // Update business plan
      await db
        .update(schema.currentPlan)
        .set({
          planType: payment.plan,
          planStatus: "ACTIVE",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .where(eq(schema.currentPlan.id, payment.businessId));

      // Update daily analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existingAnalytics = await db.query.analytics.findFirst({
        where: eq(schema.analytics.date, today),
      });

      if (existingAnalytics) {
        await db
          .update(schema.analytics)
          .set({
            totalPayments: (existingAnalytics.totalPayments ?? 0) + 1,
            totalRevenue:
              (existingAnalytics.totalRevenue ?? 0) +
              (mpPayment.transaction_amount ?? 0),
          })
          .where(eq(schema.analytics.date, today));
      } else {
        await db.insert(schema.analytics).values({
          date: today,
          totalPayments: 1,
          totalRevenue: mpPayment.transaction_amount ?? 0,
        });
      }

      invalidateBusiness(payment.businessId);

      return payment;
    } catch (error) {
      console.error("Error processing payment success:", error);
      throw error;
    }
  });
