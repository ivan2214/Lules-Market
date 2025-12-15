import { os } from "@orpc/server";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import z from "zod";
import { type BusinessWithRelations, db } from "@/db";
import { business, category as categorySchema, product } from "@/db/schema";

export const featuredBusinesses = os
  .route({
    method: "GET",
    summary: "Obtener negocios destacados",
    description: "Obtener una lista de negocios destacados",
    tags: ["Business"],
  })
  .input(z.void())
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

    if (sortBy === "newest") {
      conditions.push(desc(business.createdAt));
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
        orderBy: [desc(business.createdAt)],
        ...(page && limit ? { offset: (page - 1) * limit, limit: limit } : {}),
      }),
      db.select({ count: count() }).from(business).where(whereClause),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return { businesses, total };
  });
