import { Elysia, type Static, t } from "elysia";

export const webhookModel = new Elysia().model({
  "webhook.payload": t.Object({
    type: t.Optional(t.String()),
    topic: t.Optional(t.String()),
    action: t.Optional(t.String()),
    data: t.Optional(
      t.Object({
        id: t.Optional(t.Union([t.String(), t.Number()])),
        status: t.Optional(t.String()),
        status_detail: t.Optional(t.String()),
        external_reference: t.Optional(t.String()),
        metadata: t.Optional(t.Any()),
      }),
    ),
    external_reference: t.Optional(t.String()),
    metadata: t.Optional(t.Any()),
  }),
  "webhook.response": t.Union([
    t.Object({ received: t.Boolean() }),
    t.Object({ error: t.String() }),
  ]),
});

export namespace WebhookModel {
  export const payload = webhookModel.models["webhook.payload"];
  export type Payload = Static<typeof payload.schema>;

  export const response = webhookModel.models["webhook.response"];
  export type Response = Static<typeof response.schema>;
}
