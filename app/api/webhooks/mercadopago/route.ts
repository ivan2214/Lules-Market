import crypto from "node:crypto";
import { paymentClient } from "@/lib/mercadopago";
import prisma from "@/lib/prisma";

/**
 * Webhook handler Mercado Pago
 * - Usa raw body para verificar firma
 * - Guarda WebhookEvent en DB para idempotencia
 * - Confirma pago contra la API de MP antes de marcar approved
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = request.headers;
    const signature = headersList.get("x-signature") || "";
    const requestId = headersList.get("x-request-id") || "";
    const secret = process.env.MP_WEBHOOK_SECRET || "";
    if (
      !verifyWebhookSignature({
        signature,
        secret,
        requestId,
        dataId: getMpIdFromBody(body),
      })
    ) {
      return Response.json(
        { error: "Invalid webhook signature" },
        { status: 200 },
      );
    }

    // Intentar crear registro de evento; si existe, devolvemos 200 (ya procesado o en proceso)
    try {
      await prisma.webhookEvent.create({
        data: {
          requestId: requestId || buildRequestId(body),
          eventType: body.type || body.type || "unknown",
          mpId: getMpIdFromBody(body),
          payload: body,
        },
      });
      // biome-ignore lint/suspicious/noExplicitAny: <reason>
    } catch (err: any) {
      // Si la creación falla por unique constraint -> ya procesado
      if (isPrismaUniqueConstraintError(err)) {
        console.log(
          "Webhook already received (idempotent), skipping processing:",
          requestId,
        );
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
        });
      }
      console.error("Error creating webhookEvent:", err);
      // fallback: respond 500
      return new Response(JSON.stringify({ error: "DB error" }), {
        status: 500,
      });
    }

    // Process known events
    if (body.type === "payment" || body.topic === "payment") {
      // Mercado Pago puede enviar "topic" or "type" depending on API version
      const mpPaymentId = String(
        body.data?.id || body.data?.id || getMpIdFromBody(body),
      );
      // Confirm with Mercado Pago API the current status (defense in depth)
      let mpPayment = null;
      try {
        if (mpPaymentId) {
          const mpResp = await paymentClient.get({ id: mpPaymentId });
          mpPayment = mpResp || null;
        }
      } catch (err) {
        console.warn(
          "Error fetching payment from MP API, continuing with webhook payload",
          err,
        );
      }

      if (!mpPayment) {
        console.warn("No payment found in MP API for id:", mpPaymentId);
        return new Response(JSON.stringify({ error: "Payment not found" }), {
          status: 404,
        });
      }

      const externalReference =
        mpPayment.external_reference ||
        mpPayment.metadata?.external_reference ||
        mpPayment.id ||
        null;

      // Prefer external_reference in preference creation we stored payment.id there.
      let paymentIdDB = externalReference || findPaymentIdInPayload(body);

      if (!paymentIdDB) {
        const paymentByMP = await prisma.payment.findUnique({
          where: { mpPaymentId },
        });
        if (paymentByMP) {
          paymentIdDB = paymentByMP.id;
        }
      }

      // Decide status using mpPayment if available, otherwise payload
      const mpStatus =
        mpPayment?.status ||
        body.action ||
        body.data?.status ||
        body.data?.status_detail ||
        null;
      const normalizedStatus = normalizeMpStatus(
        String(mpStatus || "").toLowerCase(),
      );

      if (!paymentIdDB) {
        console.warn(
          "No external_reference/paymentId in payload. Skipping DB update.",
        );
      } else {
        // fetch payment record
        const paymentRecord = await prisma.payment.findUnique({
          where: { id: paymentIdDB },
        });
        if (!paymentRecord) {
          console.warn("Payment record not found for id:", paymentIdDB);
        } else {
          // Based on normalized status, update DB and business as needed
          if (normalizedStatus === "approved") {
            // Update payment + business in a transaction
            const expireAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            await prisma.$transaction([
              prisma.payment.update({
                where: { id: paymentIdDB },
                data: {
                  status: "approved",
                  mpStatus: mpStatus,
                  mpPaymentId,
                  paymentMethod: mpPayment?.payment_method_id ?? undefined,
                  amount: mpPayment?.transaction_amount ?? paymentRecord.amount,
                  currency: mpPayment?.currency_id ?? paymentRecord.currency,
                },
              }),
              prisma.business.update({
                where: { id: paymentRecord.businessId },
                data: {
                  plan: paymentRecord.plan,
                  planStatus: "ACTIVE",
                  planExpiresAt: expireAt,
                },
              }),
              prisma.webhookEvent.update({
                where: { requestId },
                data: { processed: true, processedAt: new Date() },
              }),
            ]);
          } else if (normalizedStatus === "pending") {
            await prisma.payment.update({
              where: { id: paymentIdDB },
              data: {
                status: "pending",
                mpStatus: mpStatus,
                mpPaymentId,
              },
            });
            await prisma.webhookEvent.update({
              where: { requestId },
              data: { processed: true, processedAt: new Date() },
            });
          } else {
            // rejected/failed/other
            await prisma.payment.update({
              where: { id: paymentIdDB },
              data: {
                status: "rejected",
                mpStatus: mpStatus,
                mpPaymentId,
              },
            });
            await prisma.webhookEvent.update({
              where: { requestId },
              data: { processed: true, processedAt: new Date() },
            });
          }
        }
      }
    } else {
      // Otros eventos: merchant_order, chargeback, subscription etc. Log y guardar.
      console.log("Unhandled event type:", body.type, "payload:", body);
      await prisma.webhookEvent.update({
        where: { requestId },
        data: { processed: true, processedAt: new Date() },
      });
    }

    // Todo bien
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      { status: 500 },
    );
  }
}

/* ----------------- Helpers ----------------- */
// biome-ignore lint/suspicious/noExplicitAny: <reason>
function getMpIdFromBody(body: any): string | null {
  return body.data?.id ? String(body.data.id) : null;
}

function normalizeMpStatus(s: string) {
  // possible statuses: approved, pending, rejected, in_process, cancelled, refunded
  if (!s) return "unknown";
  if (s.includes("approved")) return "approved";
  if (s.includes("pending") || s.includes("in_process")) return "pending";
  if (s.includes("rejected") || s.includes("cancel") || s.includes("refused"))
    return "rejected";
  return s;
}

function isPrismaUniqueConstraintError(err: {
  code: string;
  // biome-ignore lint/suspicious/noExplicitAny: <reason>
  meta: { target: any };
}) {
  return err?.code === "P2002" || err?.meta?.target; // P2002 unique constraint
}

// biome-ignore lint/suspicious/noExplicitAny: <reason>
function buildRequestId(body: any) {
  // fallback: t+event+hash
  const now = Date.now();
  const short = crypto
    .createHash("sha1")
    .update(JSON.stringify(body))
    .digest("hex")
    .slice(0, 8);
  return `mp-${now}-${short}`;
}

// biome-ignore lint/suspicious/noExplicitAny: <reason>
function findPaymentIdInPayload(body: any): string | null {
  try {
    // Caso más común: viene directo
    if (body.external_reference) {
      return String(body.external_reference);
    }

    // Cuando MP manda el objeto payment completo
    if (body.data?.external_reference) {
      return String(body.data.external_reference);
    }

    // A veces lo incluye en metadata
    if (body.data?.metadata?.paymentId) {
      return String(body.data.metadata.paymentId);
    }
    if (body.data?.metadata?.id) {
      return String(body.data.metadata.id);
    }

    // Por las dudas si la preferencia estaba configurada raro
    if (body.metadata?.paymentId) {
      return String(body.metadata.paymentId);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Verificar la firma del webhook de Mercado Pago
 * @param signature - Firma del header x-signature
 * @param body - Cuerpo de la solicitud
 * @param secret - Secret del webhook configurado en MP
 * @returns boolean
 */
function verifyWebhookSignature({
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

    // manifest según docs oficiales
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
    console.error("verifyWebhookSignature error:", err);
    return false;
  }
}
