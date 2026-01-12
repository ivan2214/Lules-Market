import { and, eq, inArray } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env/server";
import { CACHE_KEYS, invalidateCache } from "@/lib/cache";
import { getCurrentBusiness } from "@/orpc/actions/business/get-current-business"; // Reusing this for now
import { AppError } from "../errors";
import { authPlugin } from "../plugins/auth";

// Shared Schemas via TypeBox
const ImageSchema = t.Object({
  key: t.String({ error: "Image key is required" }),
  url: t.Optional(t.String()),
  isMainImage: t.Boolean({ error: "isMainImage must be boolean" }),
});

const ProductCreateBody = t.Object({
  name: t.String({ minLength: 1, error: "Name is required" }),
  description: t.String({ minLength: 1, error: "Description is required" }),
  price: t.Number({ minimum: 0, error: "Price must be positive" }),
  category: t.String({ minLength: 1, error: "Category is required" }),
  active: t.Optional(t.Boolean()),
  images: t.Array(ImageSchema, {
    minItems: 1,
    error: "At least one image is required",
  }),
});

const ProductUpdateBody = t.Composite([
  ProductCreateBody,
  t.Object({
    productId: t.String({ minLength: 1, error: "Product ID is required" }),
  }),
]);

const ProductDeleteQuery = t.Object({
  productId: t.String({ minLength: 1, error: "Product ID is required" }),
});

export const productsRouter = new Elysia({ prefix: "/products" })
  .use(authPlugin)
  .post(
    "/",
    async ({ body }) => {
      const [err, result] = await getCurrentBusiness();

      if (err || !result.currentBusiness) {
        throw new AppError("Negocio no encontrado", "NOT_FOUND");
      }
      const { currentBusiness } = result;

      const input = body;
      const imageKeys = input.images.map((image) => image.key);

      let imagesDB = await db.query.image.findMany({
        where: inArray(schema.image.key, imageKeys),
      });

      const existingKeys = new Set(imagesDB.map((img) => img.key));
      const imagesToCreate = input.images.filter(
        (image) => !existingKeys.has(image.key),
      );

      if (imagesToCreate.length > 0) {
        await db.insert(schema.image).values(
          imagesToCreate.map((img) => ({
            key: img.key,
            url: `${env.S3_BUCKET_URL}/${img.key}`,
            isMainImage: img.isMainImage,
          })),
        );

        imagesDB = await db.query.image.findMany({
          where: inArray(schema.image.key, imageKeys),
        });
      }

      const [product] = await db
        .insert(schema.product)
        .values({
          name: input.name,
          description: input.description,
          price: Number(input.price),
          businessId: currentBusiness.id,
          active: input.active ?? true,
        })
        .returning();

      if (!product) {
        throw new AppError("Error al crear producto", "INTERNAL_SERVER_ERROR");
      }

      if (imagesDB.length > 0) {
        for (const img of imagesDB) {
          await db
            .update(schema.image)
            .set({ productId: product.id })
            .where(eq(schema.image.key, img.key));
        }
      }

      let categoryId: string;
      const existingCategory = await db.query.category.findFirst({
        where: eq(schema.category.value, input.category),
      });

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const [newCategory] = await db
          .insert(schema.category)
          .values({
            label: input.category,
            value: input.category,
          })
          .returning();
        categoryId = newCategory.id;
      }

      await db
        .update(schema.product)
        .set({ categoryId })
        .where(eq(schema.product.id, product.id));

      void invalidateCache(CACHE_KEYS.PATTERNS.ALL_PRODUCTS);
      void invalidateCache(CACHE_KEYS.product(product.id));
      void invalidateCache(CACHE_KEYS.business(currentBusiness.id));

      return { success: true, product };
    },
    {
      role: "business",
      body: ProductCreateBody,
    },
  )
  .put(
    "/",
    async ({ body }) => {
      const [err, result] = await getCurrentBusiness();
      if (err || !result.currentBusiness)
        throw new AppError("Negocio no encontrado", "NOT_FOUND");
      const { currentBusiness } = result;

      const { productId, ...data } = body;

      const product = await db.query.product.findFirst({
        where: and(
          eq(schema.product.id, productId),
          eq(schema.product.businessId, currentBusiness.id),
        ),
      });

      if (!product) throw new AppError("Producto no encontrado", "NOT_FOUND");

      const [updated] = await db
        .update(schema.product)
        .set({
          name: data.name,
          description: data.description,
          price: data.price,
          active: data.active,
        })
        .where(eq(schema.product.id, productId))
        .returning();

      void invalidateCache(CACHE_KEYS.product(productId));

      return { success: true, product: updated };
    },
    {
      role: "business",
      body: ProductUpdateBody,
    },
  )
  .delete(
    "/",
    async ({ query }) => {
      const [err, result] = await getCurrentBusiness();
      if (err || !result.currentBusiness)
        throw new AppError("Negocio no encontrado", "NOT_FOUND");

      const { productId } = query;

      await db
        .delete(schema.product)
        .where(
          and(
            eq(schema.product.id, productId),
            eq(schema.product.businessId, result.currentBusiness.id),
          ),
        );

      void invalidateCache(CACHE_KEYS.product(productId));

      return { success: true };
    },
    {
      role: "business",
      query: ProductDeleteQuery,
    },
  );
