import { and, eq, inArray } from "drizzle-orm";
import { Elysia, t } from "elysia";
import {
  getProductByIdCache,
  getSimilarProductsCache,
  listAllProductsCache,
  recentProductsCache,
} from "@/core/cache-functions/products";
import { db } from "@/db";
import { models } from "@/db/model";
import * as schema from "@/db/schema";
import { productView as productViewSchema } from "@/db/schema";
import { env } from "@/env/server";
import { CACHE_KEYS, invalidateCache } from "@/lib/cache";
import {
  listAllProductsInputSchema,
  ProductCreateBody,
  ProductDeleteQuery,
  ProductUpdateBody,
} from "@/shared/schemas/product";
import { AppError } from "../errors";
import { authPlugin } from "../plugins/auth";

// Shared Schemas via TypeBox
// Shared Schemas via TypeBox
// Imported from @/shared/schemas/product

export const productsPrivateRouter = new Elysia({ prefix: "/products/private" })
  .use(authPlugin)
  .get(
    "/by-business",
    async ({ currentBusiness }) => {
      const products = await db.query.product.findMany({
        where: eq(schema.product.businessId, currentBusiness.id),
        with: {
          images: true,
          category: true,
        },
      });
      return { success: true, products };
    },
    {
      currentBusiness: true,
      isBusiness: true,
    },
  )
  .post(
    "/",
    async ({ body, currentBusiness }) => {
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
      isBusiness: true,
      currentBusiness: true,
      body: ProductCreateBody,
    },
  )
  .put(
    "/",
    async ({ body, currentBusiness }) => {
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
          brand: data.brand,
          discount: data.discount,
          stock: data.stock,
          tags: data.tags,
        })
        .where(eq(schema.product.id, productId))
        .returning();

      void invalidateCache(CACHE_KEYS.product(productId));

      return { success: true, product: updated };
    },
    {
      currentBusiness: true,
      isBusiness: true,
      body: ProductUpdateBody,
    },
  )
  .delete(
    "/",
    async ({ query, currentBusiness }) => {
      const { productId } = query;

      await db
        .delete(schema.product)
        .where(
          and(
            eq(schema.product.id, productId),
            eq(schema.product.businessId, currentBusiness.id),
          ),
        );

      void invalidateCache(CACHE_KEYS.product(productId));

      return { success: true };
    },
    {
      currentBusiness: true,
      isBusiness: true,
      query: ProductDeleteQuery,
    },
  );

export const productsPublicRouter = new Elysia({
  prefix: "/products/public",
})
  .get(
    "/recent",
    async () => {
      try {
        const products = await recentProductsCache();
        return { success: true, products };
      } catch (error) {
        console.error("Error al obtener productos recientes:", error);
        throw new AppError(
          "Error al obtener productos recientes",
          "INTERNAL_SERVER_ERROR",
        );
      }
    },
    {
      response: {
        success: true,
        products: t.Array(t.Object(models.select.product)),
      },
    },
  )
  .get(
    "/list",
    async ({ query }) => {
      try {
        const { products, total, currentPage, pages } =
          await listAllProductsCache(query);

        return { products, total, currentPage, pages };
      } catch (error) {
        console.error("Error al obtener productos recientes:", error);
        throw new AppError(
          "Error al obtener productos recientes",
          "INTERNAL_SERVER_ERROR",
        );
      }
    },
    {
      query: listAllProductsInputSchema,
      response: t.Object({
        products: t.Array(models.relations.productWithRelations),
        total: t.Number(),
        pages: t.Optional(t.Number()),
        currentPage: t.Optional(t.Number()),
      }),
    },
  )
  .get(
    "/:id",
    async ({ params }) => {
      try {
        const { product } = await getProductByIdCache(params.id);
        return { product };
      } catch (error) {
        console.error("Error al obtener producto:", error);
        throw new AppError(
          "Error al obtener producto",
          "INTERNAL_SERVER_ERROR",
        );
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: t.Object({
        product: t.Optional(models.relations.productWithRelations),
      }),
    },
  )
  .get(
    "/:id/similar",
    async ({ params }) => {
      try {
        const products = await getSimilarProductsCache(
          params.categoryId,
          params.id,
        );
        return { products };
      } catch (error) {
        console.error("Error al obtener productos similares:", error);
        throw new AppError(
          "Error al obtener productos similares",
          "INTERNAL_SERVER_ERROR",
        );
      }
    },
    {
      params: t.Object({
        id: t.String(),
        categoryId: t.String(),
      }),
      response: t.Object({
        products: t.Array(models.relations.productWithRelations),
      }),
    },
  )
  .post(
    "/trackView/:productId",
    async ({ params, body }) => {
      try {
        const { productId } = params;
        const { referrer } = body;

        await db.insert(productViewSchema).values({
          productId,
          referrer,
        });
        return {
          success: true,
        };
      } catch (error) {
        console.error("Error tracking product view:", error);
        return {
          success: false,
        };
      }
    },
    {
      params: t.Object({
        productId: t.String(),
      }),
      body: t.Object({
        referrer: t.Optional(t.String()),
      }),
      response: t.Object({
        success: t.Boolean(),
      }),
    },
  );
