import { t } from "elysia";
import { models } from "@/db/model";
import {
  BusinessSetupSchema,
  BusinessUpdateSchema,
} from "@/shared/validators/business";

export namespace BusinessModel {
  export const setup = BusinessSetupSchema;
  export type Setup = typeof setup.static;

  export const setupOutput = t.Object({
    success: t.Boolean(),
  });
  export type SetupOutput = typeof setupOutput.static;

  export const update = BusinessUpdateSchema;
  export type Update = typeof update.static;

  export const listAllInput = t.Optional(
    t.Object({
      search: t.Optional(t.String()),
      category: t.Optional(t.String()),
      page: t.Optional(t.Number()),
      limit: t.Optional(t.Number()),
      sortBy: t.Optional(t.Union([t.Literal("newest"), t.Literal("oldest")])),
    }),
  );
  export type listAllInput = typeof listAllInput.static;

  export const listAllOutput = t.Object({
    businesses: t.Array(models.relations.businessWithRelations),
    total: t.Number(),
  });
  export type ListAllOutput = typeof listAllOutput.static;

  export const getByIdInput = t.Object({
    id: t.String(),
  });

  export const listSimilarInput = t.Object({
    category: t.String(),
    businessId: t.String(),
  });
  export type listSimilarInput = typeof listSimilarInput.static;
  export const listSimilarOutput = t.Object({
    businesses: t.Array(models.relations.businessWithRelations),
  });
  export type ListSimilarOutput = typeof listSimilarOutput.static;

  export const trackViewInput = t.Object({
    referrer: t.Optional(t.String()),
  });

  export const trackViewParams = t.Object({
    businessId: t.String(),
  });

  export const featuredOutput = t.Array(models.relations.businessWithRelations);
  export type FeaturedOutput = typeof featuredOutput.static;
}
