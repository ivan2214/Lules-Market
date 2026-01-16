import { t } from "elysia";
import { models } from "@/db/model";
import {
  listAllProductsInputSchema,
  ProductCreateBody,
  ProductDeleteQuery,
  ProductUpdateBody,
} from "@/shared/schemas/product";

export namespace ProductModel {
  export const listAllInput = listAllProductsInputSchema;
  export const createBody = ProductCreateBody;
  export const updateBody = ProductUpdateBody;
  export const deleteQuery = ProductDeleteQuery;

  export const idParams = t.Object({
    id: t.String(),
  });

  export const trackViewParams = t.Object({
    productId: t.String(),
  });

  export const trackViewBody = t.Object({
    referrer: t.Optional(t.String()),
  });

  export const similarParams = t.Object({
    id: t.String({
      error: "El campo id es requerido",
    }),
  });

  export const productsListAllOutput = t.Object({
    products: t.Array(models.relations.productWithRelations),
    total: t.Number(),
    pages: t.Optional(t.Number()),
    currentPage: t.Optional(t.Number()),
  });

  export type ListAllOutput = typeof productsListAllOutput.static;

  export const productOutput = t.Object({
    product: t.Optional(models.relations.productWithRelations),
  });

  export const arrayProductsOutput = t.Object({
    products: t.Array(models.relations.productWithRelations),
  });

  export const recentOutput = t.Object({
    products: t.Array(models.relations.productWithRelations),
  });

  export type RecentOutput = typeof arrayProductsOutput.static;
}
