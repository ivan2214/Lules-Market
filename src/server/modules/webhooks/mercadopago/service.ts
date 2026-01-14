import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  currentPlan as currentPlanSchema,
  payment as paymentSchema,
  webhookEvent as webhookEventSchema,
} from "@/db/schema";
import { env } from "@/env/server";
import { api } from "@/lib/eden";
import { paymentClient } from "@/lib/mercadopago";
import type { WebhookModel } from "./model";

interface ProcessWebhookParams {
  body: WebhookModel.Payload;
  signature: string;
  requestId: string;
}

interface ProcessWebhookResult {
  status: number;
  data: WebhookModel.Response;
}

export const MercadoPagoService = {
  async processWebhook({
    body,
    signature,
    requestId,
  }: ProcessWebhookParams): Promise<ProcessWebhookResult> {
    try {
      const secret = env.MP_WEBHOOK_SECRET || "";

      if (
        !this.verifySignature({
          signature,
          secret,
          requestId,
          dataId: this.getMpIdFromBody(body),
        })
      ) {
        return {
          status: 200,
          data: { error: "Invalid webhook signature" },
        };
      }

      // Intentar crear registro de evento
      const webhookCreated = await this.createWebhookEvent(body, requestId);
      if (!webhookCreated.success) {
        return {
          status: 200,
          data: webhookCreated.alreadyProcessed
            ? { received: true }
            : { error: "DB error" },
        };
      }

      // Procesar eventos conocidos
      if (body.type === "payment" || body.topic === "payment") {
        await this.processPaymentEvent(body, requestId);
      } else {
        await this.markEventAsProcessed(requestId);
      }

      return { status: 200, data: { received: true } };
    } catch (error) {
      console.error("Error processing webhook:", error);
      return {
        status: 200,
        data: { error: "Webhook processing failed" },
      };
    }
  },

  async createWebhookEvent(body: WebhookModel.Payload, requestId: string) {
    try {
      const webhookEvent = await db
        .insert(webhookEventSchema)
        .values({
          requestId: requestId || this.buildRequestId(body),
          eventType: body.type || "unknown",
          mpId: this.getMpIdFromBody(body),
          payload: body,
        })
        .returning({ id: webhookEventSchema.id });

      await api.admin.createLog.post({
        adminId: "SYSTEM",
        action: "webhook",
        details: JSON.stringify(body),
        timestamp: new Date(),
        entityType: "WebhookEvent",
        entityId: webhookEvent[0].id,
      });

      return { success: true, alreadyProcessed: false };
      // biome-ignore lint/suspicious/noExplicitAny: <temp>
    } catch (err: any) {
      console.error("Error creating webhookEvent:", err);
      return {
        success: false,
        alreadyProcessed: this.isUniqueConstraintError(err),
      };
    }
  },

  async processPaymentEvent(body: WebhookModel.Payload, requestId: string) {
    const mpPaymentId = String(body.data?.id || this.getMpIdFromBody(body));

    // Confirmar con API de Mercado Pago
    const mpPayment = await this.fetchPaymentFromMP(mpPaymentId);
    if (!mpPayment) {
      console.warn("No payment found in MP API for id:", mpPaymentId);
      return;
    }

    const externalReference =
      mpPayment.external_reference ||
      mpPayment.metadata?.external_reference ||
      mpPayment.id ||
      null;

    let paymentIdDB = externalReference || this.findPaymentIdInPayload(body);

    if (!paymentIdDB) {
      const paymentByMP = await db.query.payment.findFirst({
        where: eq(paymentSchema.mpPaymentId, mpPaymentId),
      });
      if (paymentByMP) {
        paymentIdDB = paymentByMP.id;
      }
    }

    const mpStatus =
      mpPayment?.status ||
      body.action ||
      body.data?.status ||
      body.data?.status_detail ||
      null;
    const normalizedStatus = this.normalizeMpStatus(
      String(mpStatus || "").toLowerCase(),
    );

    if (!paymentIdDB) {
      console.warn(
        "No external_reference/paymentId in payload. Skipping DB update.",
      );
      return;
    }

    const paymentRecord = await db.query.payment.findFirst({
      where: eq(paymentSchema.id, paymentIdDB),
    });

    if (!paymentRecord) {
      console.warn("Payment record not found for id:", paymentIdDB);
      return;
    }

    await this.updatePaymentRecord({
      normalizedStatus,
      mpStatus,
      mpPaymentId,
      mpPayment,
      paymentRecord,
      paymentIdDB,
      requestId,
    });
  },

  async fetchPaymentFromMP(mpPaymentId: string) {
    try {
      if (mpPaymentId) {
        const mpResp = await paymentClient.get({ id: mpPaymentId });
        return mpResp || null;
      }
      return null;
    } catch (err) {
      console.warn(
        "Error fetching payment from MP API, continuing with webhook payload",
        err,
      );
      return null;
    }
  },

  async updatePaymentRecord({
    normalizedStatus,
    mpStatus,
    mpPaymentId,
    mpPayment,
    paymentRecord,
    paymentIdDB,
    requestId,
    // biome-ignore lint/suspicious/noExplicitAny: <temp>
  }: any) {
    if (normalizedStatus === "approved") {
      const expireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await db.transaction(async (tx) => {
        await tx
          .update(paymentSchema)
          .set({
            status: "approved",
            mpStatus: mpStatus,
            mpPaymentId,
            paymentMethod: mpPayment?.payment_method_id ?? undefined,
            amount: mpPayment?.transaction_amount ?? paymentRecord.amount,
            currency: mpPayment?.currency_id ?? paymentRecord.currency,
          })
          .where(eq(paymentSchema.id, paymentIdDB));

        await tx
          .update(currentPlanSchema)
          .set({
            planType: paymentRecord.plan,
            planStatus: "ACTIVE",
            expiresAt: expireAt,
            activatedAt: new Date(),
            imagesUsed: 0,
            productsUsed: 0,
            isActive: true,
            isTrial: false,
          })
          .where(eq(currentPlanSchema.businessId, paymentRecord.businessId));

        await tx
          .update(webhookEventSchema)
          .set({ processed: true, processedAt: new Date() })
          .where(eq(webhookEventSchema.requestId, requestId));
      });
    } else if (normalizedStatus === "pending") {
      await db
        .update(paymentSchema)
        .set({ status: "pending", mpStatus: mpStatus, mpPaymentId })
        .where(eq(paymentSchema.id, paymentIdDB));
      await this.markEventAsProcessed(requestId);
    } else {
      await db
        .update(paymentSchema)
        .set({ status: "rejected", mpStatus: mpStatus, mpPaymentId })
        .where(eq(paymentSchema.id, paymentIdDB));
      await this.markEventAsProcessed(requestId);
    }
  },

  async markEventAsProcessed(requestId: string) {
    await db
      .update(webhookEventSchema)
      .set({ processed: true, processedAt: new Date() })
      .where(eq(webhookEventSchema.requestId, requestId));
  },

  getMpIdFromBody(body: WebhookModel.Payload): string | null {
    return body.data?.id ? String(body.data.id) : null;
  },

  normalizeMpStatus(s: string) {
    if (!s) return "unknown";
    if (s.includes("approved")) return "approved";
    if (s.includes("pending") || s.includes("in_process")) return "pending";
    if (s.includes("rejected") || s.includes("cancel") || s.includes("refused"))
      return "rejected";
    return s;
  },

  // biome-ignore lint/suspicious/noExplicitAny: <temp>
  isUniqueConstraintError(err: { code: string; constraint?: any }) {
    return err?.code === "23505" || err?.constraint;
  },

  buildRequestId(body: WebhookModel.Payload) {
    const now = Date.now();
    const short = crypto
      .createHash("sha1")
      .update(JSON.stringify(body))
      .digest("hex")
      .slice(0, 8);
    return `mp-${now}-${short}`;
  },

  findPaymentIdInPayload(body: WebhookModel.Payload): string | null {
    try {
      if (body.external_reference) {
        return String(body.external_reference);
      }
      if (body.data?.external_reference) {
        return String(body.data.external_reference);
      }
      if (body.data?.metadata?.paymentId) {
        return String(body.data.metadata.paymentId);
      }
      if (body.data?.metadata?.id) {
        return String(body.data.metadata.id);
      }
      if (body.metadata?.paymentId) {
        return String(body.metadata.paymentId);
      }
      return null;
    } catch {
      return null;
    }
  },

  verifySignature({
    signature,
    secret,
    dataId,
    requestId,
  }: {
    signature: string;
    secret: string;
    dataId: string | null;
    requestId?: string | null;
  }): boolean {
    try {
      if (!signature || !secret || !dataId) return false;

      const parts = signature.split(",").map((p) => p.trim());
      const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
      const v1 = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

      if (!ts || !v1) return false;

      let manifest = `id:${String(dataId).toLowerCase()};`;
      if (requestId) {
        manifest += `request-id:${requestId};`;
      }
      manifest += `ts:${ts};`;

      const expected = crypto
        .createHmac("sha256", secret)
        .update(manifest)
        .digest("hex");

      const a = Buffer.from(v1, "hex");
      const b = Buffer.from(expected, "hex");
      if (a.length !== b.length) return false;

      return crypto.timingSafeEqual(a, b);
    } catch (err) {
      console.error("verifySignature error:", err);
      return false;
    }
  },
};
