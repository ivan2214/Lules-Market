import { t } from "elysia";
import { models } from "@/db/model";

export namespace PlanModel {
  export const listAllOutput = t.Array(t.Object(models.select.plan));

  // Param schemas
  export const planTypeParam = t.Object({
    type: t.Union([
      t.Literal("FREE"),
      t.Literal("BASIC"),
      t.Literal("PREMIUM"),
    ]),
  });

  // Body schemas
  export const updatePlanBody = t.Partial(
    t.Object({
      name: t.String({ minLength: 1 }),
      description: t.String({ minLength: 1 }),
      price: t.Number({ minimum: 0 }),
      discount: t.Number({ minimum: 0, maximum: 100 }),
      features: t.Array(t.String()),
      maxProducts: t.Number({ minimum: 0 }),
      maxImagesPerProduct: t.Number({ minimum: 0 }),
      hasStatistics: t.Boolean(),
      details: t.Object({
        products: t.String(),
        images: t.String(),
        priority: t.String(),
      }),
      popular: t.Boolean(),
      isActive: t.Boolean(),
      listPriority: t.Union([
        t.Literal("Estandar"),
        t.Literal("Media"),
        t.Literal("Alta"),
      ]),
    }),
  );

  export const pausePlanBody = t.Object({
    isActive: t.Boolean(),
  });

  // Response schemas
  export const successResponse = t.Object({
    success: t.Boolean(),
    message: t.String(),
  });
}
