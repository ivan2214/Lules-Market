import "server-only";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  not,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  account,
  business as businesSchema,
  businessView as businessViewSchema,
  category as categorySchema,
  currentPlan as currentPlanSchema,
  image,
  plan,
  product,
  product as productSchema,
  session,
  user as userSchema,
} from "@/db/schema";
import type { BusinessWithRelations } from "@/db/types";
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
import type { BusinessModel } from "./model";

export const BusinessService = {
  // --- MUTATIONS ---

  async setup(input: BusinessModel.Setup) {
    try {
      const { category } = input;

      /*  const existingBusiness = await db.query.business.findFirst({
        where: eq(businesSchema.name, input.name),
      });

      if (existingBusiness) {
        throw new AppError(
          "Ya existe un comercio con ese nombre",
          "BAD_REQUEST",
        );
      } */

      const user = await db.query.user.findFirst({
        where: eq(userSchema.email, input.userEmail),
      });

      if (!user) {
        throw new AppError("Usuario no encontrado", "NOT_FOUND");
      }

      // Handle category
      let categoryId: string | null = null;
      const categoryDB = await db.query.category.findFirst({
        where: eq(categorySchema.value, category?.toLowerCase() || ""),
      });

      if (categoryDB) {
        categoryId = categoryDB.id;
      } else if (category) {
        const [newCategory] = await db
          .insert(categorySchema)
          .values({
            value: category?.toLowerCase(),
            label: category,
          })
          .returning();
        categoryId = newCategory.id;
      }

      const [newBusiness] = await db
        .insert(businesSchema)
        .values({
          name: input.name,
          description: input.description,
          phone: input.phone,
          whatsapp: input.whatsapp,
          website: input.website,
          facebook: input.facebook,
          instagram: input.instagram,
          address: input.address,
          categoryId,
          userId: user.id,
          tags: input.tags,
        })
        .returning();

      // Create logo if exists
      if (input.logo?.key) {
        await db.insert(image).values({
          key: input.logo.key,
          url: `${env.S3_BUCKET_URL}/${input.logo.key}`,
          isMainImage: true,
          logoBusinessId: newBusiness.id,
        });
      }

      // Create cover image if exists
      if (input.coverImage?.key) {
        await db.insert(image).values({
          key: input.coverImage.key,
          url: `${env.S3_BUCKET_URL}/${input.coverImage.key}`,
          isMainImage: true,
          coverBusinessId: newBusiness.id,
        });
      }

      // Update user role to BUSINESS
      await db
        .update(userSchema)
        .set({ role: "BUSINESS" })
        .where(eq(userSchema.id, user.id));

      // Invalidar caché
      void invalidateCache(CACHE_KEYS.PATTERNS.ALL_BUSINESSES);
      void invalidateCacheKeys(CACHE_KEYS.HOMEPAGE_STATS);

      return { success: true };
    } catch (error) {
      console.log(error);
      throw new AppError("Error al crear el comercio", "INTERNAL_SERVER_ERROR");
    }
  },

  async update(userId: string, input: BusinessModel.Update) {
    const { category } = input;

    const currentBusiness = await db.query.business.findFirst({
      where: eq(businesSchema.userId, userId),
      with: {
        logo: true,
        coverImage: true,
      },
    });

    if (!currentBusiness) {
      throw new AppError("Business not found", "NOT_FOUND");
    }

    // Delete previous logo if being replaced
    if (input.logo && input.logo.key) {
      await db
        .delete(image)
        .where(eq(image.logoBusinessId, currentBusiness.id));

      // Create new logo
      await db.insert(image).values({
        key: input.logo.key,
        url: `${env.S3_BUCKET_URL}/${input.logo.key}`,
        isMainImage: true,
        logoBusinessId: currentBusiness.id,
      });
    }

    if (input.coverImage && input.coverImage.key) {
      await db
        .delete(image)
        .where(eq(image.coverBusinessId, currentBusiness.id));
      // Create new cover image
      await db.insert(image).values({
        key: input.coverImage.key,
        url: `${env.S3_BUCKET_URL}/${input.coverImage.key}`,
        isMainImage: true,
        coverBusinessId: currentBusiness.id,
      });
    }

    // Handle category
    let categoryId = currentBusiness.categoryId;

    if (category) {
      const categoryDB = await db.query.category.findFirst({
        where: eq(categorySchema.value, category.toLowerCase()),
      });

      if (categoryDB) {
        categoryId = categoryDB.id;
      } else {
        const [newCategory] = await db
          .insert(categorySchema)
          .values({
            value: category.toLowerCase(),
            label: category,
          })
          .returning();
        categoryId = newCategory.id;
      }
    }

    const [updated] = await db
      .update(businesSchema)
      .set({
        name: input.name,
        description: input.description,
        phone: input.phone,
        whatsapp: input.whatsapp,
        website: input.website ?? null, // Ensure null if undefined
        facebook: input.facebook ?? null,
        instagram: input.instagram ?? null,
        address: input.address ?? null,
        categoryId,
      })
      .where(eq(businesSchema.id, currentBusiness.id))
      .returning();

    revalidatePath(`/comercio/${updated.id}`);

    // Invalidar caché de negocios
    void invalidateCache(CACHE_KEYS.PATTERNS.ALL_BUSINESSES);
    void invalidateCacheKeys(CACHE_KEYS.business(updated.id));

    return {
      success: true,
      business: updated,
    };
  },

  async delete(userId: string) {
    const currentBusiness = await db.query.business.findFirst({
      where: eq(businesSchema.userId, userId),
      with: {
        logo: true,
        coverImage: true,
      },
    });

    if (!currentBusiness) {
      throw new AppError("Business not found", "NOT_FOUND");
    }

    try {
      // Get all products
      const products = await db.query.product.findMany({
        where: eq(product.businessId, currentBusiness.id),
        columns: { id: true },
      });

      const productIds = products.map((p) => p.id);

      // Get all images for products
      const imagesProducts =
        productIds.length > 0
          ? await db.query.image.findMany({
              where: inArray(image.productId, productIds),
              columns: { key: true },
            })
          : [];

      // Get logo and cover images
      const logoImage = await db.query.image.findFirst({
        where: eq(image.logoBusinessId, currentBusiness.id),
      });

      const coverImage = await db.query.image.findFirst({
        where: eq(image.coverBusinessId, currentBusiness.id),
      });

      const allImages = [
        ...imagesProducts,
        ...(logoImage ? [logoImage] : []),
        ...(coverImage ? [coverImage] : []),
      ];

      // Delete images from S3 and DB
      await Promise.all(
        allImages.map(async (img) => {
          await Promise.all([
            db.delete(image).where(eq(image.key, img.key)).catch(console.error),
          ]);
        }),
      );

      // Delete related records
      await Promise.all([
        db.delete(product).where(eq(product.businessId, currentBusiness.id)),
        db.delete(session).where(eq(session.userId, currentBusiness.userId)),
        db.delete(account).where(eq(account.userId, currentBusiness.userId)),
      ]);

      // Delete business
      await db
        .delete(businesSchema)
        .where(eq(businesSchema.id, currentBusiness.id));

      // Delete user
      await db
        .delete(userSchema)
        .where(eq(userSchema.id, currentBusiness.userId));

      // Invalidar caché de negocios y productos
      void invalidateCache(CACHE_KEYS.PATTERNS.ALL_BUSINESSES);
      void invalidateCacheKeys(CACHE_KEYS.business(currentBusiness.id));
      void invalidateCache(CACHE_KEYS.PATTERNS.ALL_PRODUCTS);
      void invalidateCacheKeys(CACHE_KEYS.HOMEPAGE_STATS);

      return { success: true };
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) throw error;
      throw new AppError("Error deleting business", "INTERNAL_SERVER_ERROR");
    }
  },

  async trackView(
    businessId: string,
    referrer?: string,
  ): Promise<{ success: boolean }> {
    try {
      await db.insert(businessViewSchema).values({
        businessId,
        referrer,
      });
      return { success: true };
    } catch (error) {
      console.error("Error tracking business view:", error);
      return { success: false };
    }
  },

  // --- QUERIES (CACHED) ---

  async getFeatured(): Promise<BusinessModel.FeaturedOutput> {
    return getCachedOrFetch(
      CACHE_KEYS.BUSINESSES_FEATURED,
      async () => {
        // 1. Obtener IDs ordenados por prioridad del plan y fecha de creación
        const sortedIds = await db
          .select({ id: businesSchema.id })
          .from(businesSchema)
          .innerJoin(
            currentPlanSchema,
            eq(businesSchema.id, currentPlanSchema.businessId),
          )
          .innerJoin(plan, eq(currentPlanSchema.planType, plan.type))
          .where(and(eq(businesSchema.isActive, true)))
          .orderBy(
            sql`CASE
          WHEN ${plan.type} = 'PREMIUM' THEN 3
          WHEN ${plan.type} = 'BASIC' THEN 2
          WHEN ${plan.type} = 'FREE' THEN 1
          ELSE 0
        END DESC`,
            desc(businesSchema.createdAt),
          )
          .limit(6);

        if (sortedIds.length === 0) return [];

        const ids = sortedIds.map((row) => row.id);

        // 2. Obtener data completa usando la API relacional para mantener estructura
        const featuredBusinesses = await db.query.business.findMany({
          where: inArray(businesSchema.id, ids),
          with: {
            category: true,
            logo: true,
          },
        });

        // 3. Reordenar según el orden de los IDs obtenidos
        const orderedBusinesses = featuredBusinesses.sort((a, b) => {
          return ids.indexOf(a.id) - ids.indexOf(b.id);
        });

        return orderedBusinesses as BusinessWithRelations[];
      },
      CACHE_TTL.BUSINESSES_FEATURED,
    );
  },

  async listAll(
    input?: BusinessModel.listAllInput,
  ): Promise<BusinessModel.ListAllOutput> {
    const cacheKey = generateCacheKey("businesses:list", input ?? {});

    return getCachedOrFetch(
      cacheKey,
      async () => {
        const { search, category, page = 1, limit = 12, sortBy } = input ?? {};

        // Build where conditions
        const conditions: SQL[] = [eq(businesSchema.isActive, true)];

        if (search) {
          conditions.push(
            or(
              ilike(businesSchema.name, `%${search}%`),
              ilike(businesSchema.description, `%${search}%`),
            ) as SQL<string>,
          );
        }

        if (category) {
          const categoryDB = await db.query.category.findFirst({
            where: eq(categorySchema.value, category),
          });

          categoryDB &&
            conditions.push(eq(businesSchema.categoryId, categoryDB.id));
        }

        const whereClause = and(...conditions);

        // Build order by
        const orderBy = [];

        const prioritySort = sql`CASE
          WHEN ${currentPlanSchema.listPriority} = 'Alta' THEN 3
          WHEN ${currentPlanSchema.listPriority} = 'Media' THEN 2
          WHEN ${currentPlanSchema.listPriority} = 'Estandar' THEN 1
          ELSE 0
        END DESC`;

        if (sortBy === "oldest") {
          orderBy.push(asc(businesSchema.createdAt));
        } else if (sortBy === "newest") {
          orderBy.push(desc(businesSchema.createdAt));
        } else {
          // Default sort: Priority
          orderBy.push(prioritySort);
        }

        orderBy.push(desc(businesSchema.createdAt), desc(businesSchema.id));

        const [idsResult, totalResult] = await Promise.all([
          db
            .select({ id: businesSchema.id })
            .from(businesSchema)
            .innerJoin(
              currentPlanSchema,
              eq(businesSchema.id, currentPlanSchema.businessId),
            )
            .where(whereClause)
            .orderBy(...orderBy)
            .offset((page - 1) * limit)
            .limit(limit),
          db
            .select({ count: count() })
            .from(businesSchema)
            .innerJoin(
              currentPlanSchema,
              eq(businesSchema.id, currentPlanSchema.businessId),
            )
            .where(whereClause),
        ]);

        const total = totalResult[0]?.count ?? 0;

        if (idsResult.length === 0) {
          return {
            businesses: [],
            total,
            ...(limit ? { pages: Math.ceil(total / limit) } : {}),
            ...(page ? { currentPage: page } : {}),
          };
        }

        const ids = idsResult.map((row) => row.id);

        const businesses = await db.query.business.findMany({
          where: inArray(businesSchema.id, ids),
          with: {
            products: {
              where: eq(product.active, true),
              with: {
                images: true,
              },
            },
            currentPlan: {
              with: {
                plan: true,
              },
            },
            category: true,
            logo: true,
            coverImage: true,
          },
        });

        const orderedBusinesses = businesses.sort((a, b) => {
          return ids.indexOf(a.id) - ids.indexOf(b.id);
        });

        return {
          businesses: orderedBusinesses,
          total,
          ...(limit ? { pages: Math.ceil(total / limit) } : {}),
          ...(page ? { currentPage: page } : {}),
        };
      },
      CACHE_TTL.BUSINESSES_LIST,
    );
  },

  async getById(id: string): Promise<BusinessModel.GetByIdOutput> {
    return getCachedOrFetch(
      CACHE_KEYS.business(id),
      async () => {
        const businessData = await db.query.business.findFirst({
          where: eq(businesSchema.id, id),
          with: {
            category: true,
            logo: true,
            coverImage: true,
            products: {
              where: eq(product.active, true),
              limit: 12,
              orderBy: desc(product.createdAt),
              with: {
                images: true,
              },
            },
            user: true,
          },
        });

        return { business: businessData };
      },
      CACHE_TTL.BUSINESS_BY_ID,
    );
  },

  async listSimilar(
    input: BusinessModel.listSimilarInput,
  ): Promise<BusinessModel.ListSimilarOutput> {
    const cacheKey = CACHE_KEYS.businessesSimilar(
      input.category,
      input.businessId,
      input.limit?.toString() || "6",
    );

    return getCachedOrFetch(
      cacheKey,
      async () => {
        const categoryId = await db.query.category.findFirst({
          where: eq(categorySchema.value, input.category),
        });

        if (!categoryId) return { businesses: [] };

        const businesses = await db.query.business.findMany({
          where: and(
            eq(businesSchema.categoryId, categoryId.id),
            eq(businesSchema.isActive, true),
            not(eq(businesSchema.id, input.businessId)),
          ),
          limit: input.limit || 4,
          with: {
            category: true,
            logo: true,
          },
        });

        return { businesses: businesses as BusinessWithRelations[] };
      },
      CACHE_TTL.BUSINESSES_SIMILAR,
    );
  },

  async getMyProducts(businessId: string, limit: number, offset: number) {
    return getCachedOrFetch(
      CACHE_KEYS.businessMyProducts(businessId, limit, offset),
      async () => {
        const where: SQL[] = [
          eq(productSchema.businessId, businessId),
          eq(productSchema.active, true),
        ];

        return await db.query.product.findMany({
          where: and(...where),
          limit: limit,
          offset: offset,
          orderBy: [desc(productSchema.createdAt)],
          with: {
            images: true,
          },
        });
      },
      CACHE_TTL.PRODUCTS_LIST,
    );
  },
  // Para generateParams - Cache larga (1 hora o más)
  async getAllIds(): Promise<{ id: string }[]> {
    return getCachedOrFetch(
      "businesses:-ids", // Key estática simple
      async () => {
        return await db.query.business.findMany({
          where: eq(businesSchema.isActive, true),
          columns: { id: true },
          orderBy: desc(businesSchema.createdAt),
          limit: 50,
        });
      },
      CACHE_TTL.PLANS, // Usar TTL largo (1 hora)
    );
  },
};
