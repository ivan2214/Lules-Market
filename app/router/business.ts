import { os } from "@orpc/server";
import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import z from "zod";
import { business, category as categorySchema, product } from "@/db/schema";
import type { BusinessWithRelations, CategoryWithRelations } from "@/db/types";
import { db } from "@/db/types";

export const featuredBusinesses = os
  .route({
    method: "GET",
    summary: "Obtener negocios destacados",
    description: "Obtener una lista de negocios destacados",
    tags: ["Business"],
  })
  .output(z.array(z.custom<BusinessWithRelations>()))
  .handler(async () => {
    const featuredBusinesses = await db.query.business.findMany({
      where: and(eq(business.isActive, true), eq(business.isBanned, false)),
      limit: 6,
      orderBy: desc(business.createdAt),
      with: {
        category: true,
        logo: true,
      },
    });
    return featuredBusinesses;
  });

export const listAllBusinesses = os
  .route({
    method: "GET",
    summary: "Obtener todos los negocios",
    description: "Obtener una lista de todos los negocios",
    tags: ["Business"],
  })
  .input(
    z
      .object({
        search: z.string().optional(),
        category: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().optional(),
        sortBy: z.enum(["newest", "oldest"]).optional(),
      })
      .optional(),
  )
  .output(
    z.object({
      businesses: z.array(z.custom<BusinessWithRelations>()),
      total: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const { search, category, page, limit, sortBy } = input ?? {};
    // Build where conditions
    const conditions = [eq(business.isActive, true)];

    let orderBy: ReturnType<typeof asc> | ReturnType<typeof desc> | undefined;

    if (search) {
      conditions.push(
        or(
          ilike(business.name, `%${search}%`),
          ilike(business.description, `%${search}%`),
        ) as SQL<string>,
      );
    }

    if (category) {
      const categoryId = await db.query.category.findFirst({
        where: eq(categorySchema.value, category),
      });

      if (categoryId) {
        conditions.push(eq(business.categoryId, categoryId.id));
      }
    }

    if (sortBy === "oldest") {
      orderBy = asc(business.createdAt);
    } else {
      orderBy = desc(business.createdAt); // default newest
    }

    const whereClause = and(...conditions);

    const [businesses, totalResult] = await Promise.all([
      db.query.business.findMany({
        where: whereClause,
        with: {
          products: {
            where: eq(product.active, true),
            with: {
              images: true,
            },
            limit: 4,
            orderBy: [desc(product.featured), desc(product.createdAt)],
          },
          logo: true,
          category: true,
          coverImage: true,
        },
        orderBy,
        ...(page && limit ? { offset: (page - 1) * limit, limit: limit } : {}),
      }),
      db.select({ count: count() }).from(business).where(whereClause),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return { businesses, total };
  });

export const listAllBusinessesByCategories = os
  .route({
    method: "GET",
    summary: "Obtener todos los negocios por categoría",
    description: "Obtener una lista de todos los negocios por categoría",
    tags: ["Business"],
  })
  .input(z.object({ category: z.custom<CategoryWithRelations>() }))
  .output(z.object({ businesses: z.array(z.custom<BusinessWithRelations>()) }))
  .handler(async ({ input }) => {
    const { category } = input;
    const whereClause = category?.id
      ? eq(business.categoryId, category.id)
      : undefined;

    const businesses = await db.query.business.findMany({
      where: whereClause,
      with: {
        products: {
          with: {
            images: true,
          },
        },
        logo: true,
        category: true,
        coverImage: true,
      },
      orderBy: [desc(business.createdAt)],
    });

    // Filter by category in memory if needed
    const filteredBusinesses = category?.value
      ? businesses.filter((b) =>
          b.category?.value
            ?.toLowerCase()
            .includes(category.value.toLowerCase()),
        )
      : businesses;

    return { businesses: filteredBusinesses };
  });

export const getBusinessById = os
  .route({
    method: "GET",
    summary: "Obtener un negocio por ID",
    description: "Obtener un negocio por ID",
    tags: ["Business"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ business: z.custom<BusinessWithRelations>().optional() }))
  .handler(async ({ input }) => {
    const { id } = input;
    const businessFound = await db.query.business.findFirst({
      where: eq(business.id, id),
      with: {
        logo: true,
        coverImage: true,
        category: true,
        products: {
          where: eq(product.active, true),
          with: {
            images: true,
            category: true,
          },
          orderBy: [desc(product.featured), desc(product.createdAt)],
        },
      },
    });
    if (!businessFound) {
      return {
        business: undefined,
      };
    }
    return {
      business: businessFound,
    };
  });

export const businessRoute = {
  featuredBusinesses,
  listAllBusinesses,
  listAllBusinessesByCategories,
  getBusinessById,
};
