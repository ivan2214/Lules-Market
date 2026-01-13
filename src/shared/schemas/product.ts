import { t } from "elysia";
import { models } from "@/db/model";

// Shared Schemas via TypeBox
const ImageSchema = t.Object({
  key: t.String({ error: "Image key is required" }),
  url: t.Optional(t.String()),
  isMainImage: t.Boolean({ error: "isMainImage must be boolean" }),
});

export const ProductCreateBody = t.Composite([
  t.Pick(t.Object(models.insert.product), [
    "name",
    "description",
    "price",
    "active",
    "stock",
    "brand",
    "discount",
    "tags",
  ]),
  t.Object({
    category: t.String({ minLength: 1, error: "Category is required" }),
    images: t.Array(ImageSchema, {
      minItems: 1,
      error: "At least one image is required",
    }),
  }),
]);

export const ProductUpdateBody = t.Composite([
  t.Partial(
    t.Pick(t.Object(models.insert.product), [
      "name",
      "description",
      "price",
      "active",
      "stock",
      "brand",
      "discount",
      "tags",
    ]),
  ),
  t.Object({
    productId: t.String({ minLength: 1, error: "Product ID is required" }),
    category: t.Optional(
      t.String({ minLength: 1, error: "Category is required" }),
    ),
    images: t.Optional(
      t.Array(ImageSchema, {
        minItems: 1,
        error: "At least one image is required",
      }),
    ),
  }),
]);

export const ProductDeleteQuery = t.Object({
  productId: t.String({ minLength: 1, error: "Product ID is required" }),
});

export const listAllProductsInputSchema = t.Optional(
  t.Object({
    search: t.Optional(t.String()),
    category: t.Optional(t.String()),
    businessId: t.Optional(t.String()),
    page: t.Optional(
      t.Number({
        default: 1,
      }),
    ),
    limit: t.Optional(t.Number()),
    sort: t.Optional(
      t.Union([
        t.Literal("price_asc"),
        t.Literal("price_desc"),
        t.Literal("name_asc"),
        t.Literal("name_desc"),
      ]),
    ),
  }),
);
