import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  ne,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import {
  business as businessSchema,
  category as categoryDrizzle,
  category as categoryShema,
  currentPlan as currentPlanSchema,
  image as imageSchema,
  product as productSchema,
  productView as productViewSchema,
} from "@/db/schema";
import type { ProductWithRelations } from "@/db/types";
import { env } from "@/env/server";
import {
  CACHE_KEYS,
  CACHE_TTL,
  generateCacheKey,
  getCachedOrFetch,
  invalidateCache,
  invalidateCacheKeys,
} from "@/lib/cache";
import { AppError } from "@/server/errors";
import type { ProductModel } from "./model";

// Types derived from models/schemas to avoid circular deps if needed,
// but here we can rely on inferred types from shared/schemas
type ProductCreateInput = typeof ProductModel.createBody.static;
type ProductUpdateInput = typeof ProductModel.updateBody.static;

export const ProductService = {
  // --- QUERIES ---

  async listAll(input: typeof ProductModel.listAllInput.static) {
    const cacheKey = generateCacheKey("products:list", input ?? {});

    return getCachedOrFetch(
      cacheKey,
      async () => {
        const {
          search,
          category,
          businessId,
          page = 1,
          limit = 12,
          sort,
        } = input ?? {};

        const conditions: SQL<unknown>[] = [
          eq(productSchema.active, true),
          eq(businessSchema.isActive, true),
        ];

        if (businessId) {
          conditions.push(eq(productSchema.businessId, businessId));
        }

        if (search) {
          conditions.push(
            or(
              ilike(productSchema.name, `%${search}%`),
              ilike(productSchema.description, `%${search}%`),
            ) as SQL<string>,
          );
        }

        if (category) {
          const categoryDB = await db.query.category.findFirst({
            where: eq(categoryShema.value, category),
          });
          categoryDB &&
            conditions.push(eq(productSchema.categoryId, categoryDB?.id));
        }

        const whereClause = and(...conditions);

        const orderBy = [];
        const prioritySort = sql`CASE
          WHEN ${currentPlanSchema.listPriority} = 'Alta' THEN 3
          WHEN ${currentPlanSchema.listPriority} = 'Media' THEN 2
          WHEN ${currentPlanSchema.listPriority} = 'Estandar' THEN 1
          ELSE 0
        END DESC`;

        if (sort) {
          const [field, direction] = sort.split("_");
          if (field === "price") {
            orderBy.push(
              direction === "asc"
                ? asc(productSchema.price)
                : desc(productSchema.price),
            );
          } else if (field === "name") {
            orderBy.push(
              direction === "asc"
                ? asc(productSchema.name)
                : desc(productSchema.name),
            );
          }
        } else {
          orderBy.push(prioritySort);
        }

        orderBy.push(desc(productSchema.createdAt), desc(productSchema.id));

        const [idsResult, totalResult] = await Promise.all([
          db
            .select({ id: productSchema.id })
            .from(productSchema)
            .innerJoin(
              businessSchema,
              eq(productSchema.businessId, businessSchema.id),
            )
            .innerJoin(
              currentPlanSchema,
              eq(businessSchema.id, currentPlanSchema.businessId),
            )
            .where(whereClause)
            .orderBy(...orderBy)
            .offset((page - 1) * limit)
            .limit(limit),
          db
            .select({ count: count() })
            .from(productSchema)
            .innerJoin(
              businessSchema,
              eq(productSchema.businessId, businessSchema.id),
            )
            .innerJoin(
              currentPlanSchema,
              eq(businessSchema.id, currentPlanSchema.businessId),
            )
            .where(whereClause),
        ]);

        const total = totalResult[0]?.count ?? 0;

        if (idsResult.length === 0) {
          return {
            products: [],
            total,
            ...(limit ? { pages: Math.ceil(total / limit) } : {}),
            ...(page ? { currentPage: page } : {}),
          };
        }

        const ids = idsResult.map((row) => row.id);
        const products = await db.query.product.findMany({
          where: inArray(productSchema.id, ids),
          with: {
            business: {
              with: {
                currentPlan: { with: { plan: true } },
                logo: true,
              },
            },
            images: true,
            category: true,
          },
        });

        const orderedProducts = products.sort(
          (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
        );

        return {
          products: orderedProducts as ProductWithRelations[],
          total,
          ...(limit ? { pages: Math.ceil(total / limit) } : {}),
          ...(page ? { currentPage: page } : {}),
        };
      },
      CACHE_TTL.PRODUCTS_LIST,
    );
  },

  async getById(id: string) {
    return getCachedOrFetch(
      CACHE_KEYS.product(id),
      async () => {
        const productFound = await db.query.product.findFirst({
          where: eq(productSchema.id, id),
          with: {
            business: {
              with: {
                currentPlan: { with: { plan: true } },
                logo: true,
              },
            },
            images: true,
            category: true,
          },
        });
        return { product: productFound as ProductWithRelations | undefined };
      },
      CACHE_TTL.PRODUCT_BY_ID,
    );
  },

  async getRecent() {
    return getCachedOrFetch(
      CACHE_KEYS.PRODUCTS_RECENT,
      async () => {
        const sortedIds = await db
          .select({ id: productSchema.id })
          .from(productSchema)
          .innerJoin(
            businessSchema,
            eq(productSchema.businessId, businessSchema.id),
          )
          .innerJoin(
            currentPlanSchema,
            eq(businessSchema.id, currentPlanSchema.businessId),
          )
          .where(
            and(
              eq(productSchema.active, true),
              eq(businessSchema.isActive, true),
            ),
          )
          .orderBy(
            sql`CASE
            WHEN ${currentPlanSchema.listPriority} = 'Alta' THEN 3
            WHEN ${currentPlanSchema.listPriority} = 'Media' THEN 2
            WHEN ${currentPlanSchema.listPriority} = 'Estandar' THEN 1
            ELSE 0
          END DESC`,
            desc(productSchema.createdAt),
          )
          .limit(8);

        if (sortedIds.length === 0) return [];
        const ids = sortedIds.map((row) => row.id);
        const products = await db.query.product.findMany({
          where: inArray(productSchema.id, ids),
          with: {
            images: true,
            business: {
              with: {
                currentPlan: { with: { plan: true } },
                logo: true,
              },
            },
            category: true,
          },
        });

        return products.sort(
          (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
        ) as ProductWithRelations[];
      },
      CACHE_TTL.PRODUCTS_RECENT,
    );
  },

  async getSimilar(categoryId: string, currentProductId: string) {
    const cacheKey = CACHE_KEYS.productsSimilar(categoryId, currentProductId);
    return getCachedOrFetch(
      cacheKey,
      async () => {
        const similarIds = await db
          .select({ id: productSchema.id })
          .from(productSchema)
          .innerJoin(
            businessSchema,
            eq(productSchema.businessId, businessSchema.id),
          )
          .innerJoin(
            currentPlanSchema,
            eq(businessSchema.id, currentPlanSchema.businessId),
          )
          .where(
            and(
              eq(productSchema.active, true),
              eq(productSchema.categoryId, categoryId),
              ne(productSchema.id, currentProductId),
              eq(businessSchema.isActive, true),
            ),
          )
          .orderBy(
            sql`CASE
            WHEN ${currentPlanSchema.listPriority} = 'Alta' THEN 3
            WHEN ${currentPlanSchema.listPriority} = 'Media' THEN 2
            WHEN ${currentPlanSchema.listPriority} = 'Estandar' THEN 1
            ELSE 0
          END DESC`,
            desc(productSchema.createdAt),
          )
          .limit(4);

        if (similarIds.length === 0) return [];
        const ids = similarIds.map((row) => row.id);
        const similar = await db.query.product.findMany({
          where: inArray(productSchema.id, ids),
          with: {
            images: true,
            business: {
              with: {
                currentPlan: { with: { plan: true } },
                logo: true,
              },
            },
            category: true,
          },
        });
        return similar.sort(
          (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
        ) as ProductWithRelations[];
      },
      CACHE_TTL.PRODUCTS_SIMILAR,
    );
  },

  async getAllIds() {
    return getCachedOrFetch(
      "products:static-ids",
      async () => {
        return await db
          .select({ id: productSchema.id })
          .from(productSchema)
          .where(eq(productSchema.active, true))
          .orderBy(desc(productSchema.createdAt))
          .limit(50);
      },
      CACHE_TTL.PLANS,
    );
  },

  async getByBusiness(businessId: string) {
    return getCachedOrFetch(
      CACHE_KEYS.productsByBusiness(businessId),
      async () => {
        return await db.query.product.findMany({
          where: eq(productSchema.businessId, businessId),
          with: {
            images: true,
            category: true,
          },
        });
      },
      CACHE_TTL.PRODUCTS_LIST,
    );
  },

  // --- MUTATIONS ---

  async create(input: ProductCreateInput, businessId: string) {
    const imageKeys = input.images.map((image) => image.key);

    let imagesDB = await db.query.image.findMany({
      where: inArray(imageSchema.key, imageKeys),
    });

    const existingKeys = new Set(imagesDB.map((img) => img.key));
    const imagesToCreate = input.images.filter(
      (image) => !existingKeys.has(image.key),
    );

    if (imagesToCreate.length > 0) {
      await db.insert(imageSchema).values(
        imagesToCreate.map((img) => ({
          key: img.key,
          url: `${env.S3_BUCKET_URL}/${img.key}`,
          isMainImage: img.isMainImage,
        })),
      );

      imagesDB = await db.query.image.findMany({
        where: inArray(imageSchema.key, imageKeys),
      });
    }

    const [product] = await db
      .insert(productSchema)
      .values({
        name: input.name,
        description: input.description,
        price: Number(input.price),
        businessId: businessId,
        active: input.active ?? true,
      })
      .returning();

    if (!product) {
      throw new AppError("Error al crear producto", "INTERNAL_SERVER_ERROR");
    }

    if (imagesDB.length > 0) {
      for (const img of imagesDB) {
        await db
          .update(imageSchema)
          .set({ productId: product.id })
          .where(eq(imageSchema.key, img.key));
      }
    }

    let categoryId: string;
    const existingCategory = await db.query.category.findFirst({
      where: eq(categoryDrizzle.value, input.category),
    });

    if (existingCategory) {
      categoryId = existingCategory.id;
    } else {
      const [newCategory] = await db
        .insert(categoryDrizzle)
        .values({
          label: input.category,
          value: input.category,
        })
        .returning();
      categoryId = newCategory.id;
    }

    await db
      .update(productSchema)
      .set({ categoryId })
      .where(eq(productSchema.id, product.id));

    void invalidateCache(CACHE_KEYS.PATTERNS.ALL_PRODUCTS);
    void invalidateCacheKeys(CACHE_KEYS.product(product.id));
    void invalidateCacheKeys(CACHE_KEYS.business(businessId));
    void invalidateCacheKeys(CACHE_KEYS.productsByBusiness(businessId));

    return { success: true, product };
  },

  async update(input: ProductUpdateInput, businessId: string) {
    const { productId, ...data } = input;

    const product = await db.query.product.findFirst({
      where: and(
        eq(productSchema.id, productId),
        eq(productSchema.businessId, businessId),
      ),
    });

    if (!product) throw new AppError("Producto no encontrado", "NOT_FOUND");

    const [updated] = await db
      .update(productSchema)
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
      .where(eq(productSchema.id, productId))
      .returning();

    void invalidateCacheKeys(CACHE_KEYS.product(productId));

    return { success: true, product: updated };
  },

  async delete(productId: string, businessId: string) {
    await db
      .delete(productSchema)
      .where(
        and(
          eq(productSchema.id, productId),
          eq(productSchema.businessId, businessId),
        ),
      );

    void invalidateCacheKeys(CACHE_KEYS.product(productId));
    return { success: true };
  },

  async trackView(productId: string, referrer?: string) {
    try {
      await db.insert(productViewSchema).values({
        productId,
        referrer,
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  },
};
