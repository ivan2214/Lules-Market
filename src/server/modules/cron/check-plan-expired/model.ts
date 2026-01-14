import { Elysia, type Static, t } from "elysia";

export const cronModel = new Elysia().model({
  "cron.successResponse": t.Object({
    ok: t.Boolean(),
    desactivados: t.Number(),
    message: t.String(),
  }),
  "cron.errorResponse": t.Object({
    ok: t.Optional(t.Boolean()),
    error: t.String(),
  }),
});

export namespace CronModel {
  export const successResponse = cronModel.models["cron.successResponse"];
  export type SuccessResponse = Static<typeof successResponse.schema>;

  export const errorResponse = cronModel.models["cron.errorResponse"];
  export type ErrorResponse = Static<typeof errorResponse.schema>;
}
