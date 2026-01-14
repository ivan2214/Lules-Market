import { Elysia } from "elysia";
import { webhookModel } from "./model";
import { MercadoPagoService } from "./service";

export const mercadopagoWebhook = new Elysia({ prefix: "/api/webhooks" })
  .use(webhookModel)
  .post(
    "/mercadopago",
    async ({ body, headers, set }) => {
      const signature = headers["x-signature"] || "";
      const requestId = headers["x-request-id"] || "";

      const result = await MercadoPagoService.processWebhook({
        body,
        signature,
        requestId,
      });

      set.status = result.status;
      return result.data;
    },
    {
      body: "webhook.payload",
      response: {
        200: "webhook.response",
      },
    },
  );
