import { os } from "@orpc/server";
import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { product, category as schemaCategory } from "@/db/schema";
import type { ProductWithRelations } from "@/db/types";

export const recentProducts = os
  .route({
    path: "/products/recent",
    method: "GET",
    summary: "Obtener productos recientes",
    description: "Obtener una lista de productos recientes",
    tags: ["Products"],
  })
  .output(z.array(z.custom<ProductWithRelations>()))
  .handler(async () => {
    const products = await db.query.product.findMany({
      where: and(eq(product.active, true), eq(product.isBanned, false)),
      with: {
        images: true,
        business: true,
        category: true,
      },
      orderBy: [desc(product.createdAt)],
      limit: 8,
    });
    return products;
  });

export const listAllProducts = os
  .route({
    path: "/products/list",
    method: "GET",
    summary: "Obtener todos los productos",
    description: "Obtener una lista de todos los productos",
    tags: ["Products"],
  })
  .input(
    z
      .object({
        search: z.string().optional(),
        category: z.string().optional(),
        businessId: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(12),
        sort: z
          .enum(["price_asc", "price_desc", "name_asc", "name_desc"])
          .optional(),
      })
      .optional(),
  )
  .output(
    z.object({
      products: z.array(z.custom<ProductWithRelations>()),
      total: z.number(),
      pages: z.number().optional(),
      currentPage: z.number().optional(),
    }),
  )
  .handler(async ({ input }) => {
    const { search, category, businessId, page, limit, sort } = input ?? {};
    // Build where conditions
    const conditions: SQL<unknown>[] = [eq(product.active, true)];

    if (businessId) {
      conditions.push(eq(product.businessId, businessId));
    }

    if (search) {
      conditions.push(
        or(
          ilike(product.name, `%${search}%`),
          ilike(product.description, `%${search}%`),
        ) as SQL<string>,
      );
    }

    if (category) {
      const categoryDB = await db.query.category.findFirst({
        where: eq(schemaCategory.value, category),
      });

      categoryDB && conditions.push(eq(product.categoryId, categoryDB?.id));
    }

    const whereClause = and(...conditions);

    // Build order by
    const orderBy = [];

    if (sort) {
      const [field, direction] = sort.split("_");
      if (field === "price") {
        orderBy.push(
          direction === "asc" ? asc(product.price) : desc(product.price),
        );
      } else if (field === "name") {
        orderBy.push(
          direction === "asc" ? asc(product.name) : desc(product.name),
        );
      }
    }

    orderBy.push(desc(product.featured));
    orderBy.push(desc(product.createdAt));

    const [products, totalResult] = await Promise.all([
      db.query.product.findMany({
        where: whereClause,
        with: {
          business: true,
          images: true,
          category: true,
        },
        orderBy,
        ...(page && limit ? { offset: (page - 1) * limit, limit: limit } : {}),
      }),
      db.select({ count: count() }).from(product).where(whereClause),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return {
      products: products as ProductWithRelations[],
      total,
      ...(limit ? { pages: Math.ceil(total / limit) } : {}),
      ...(page ? { currentPage: page } : {}),
    };
  });

export const getProductById = os
  .route({
    path: "/products/:id",
    method: "GET",
    summary: "Obtener un producto por ID",
    description: "Obtener un producto por ID",
    tags: ["Products"],
  })
  .input(z.object({ id: z.string() }))
  .output(z.object({ product: z.custom<ProductWithRelations>().optional() }))
  .handler(async ({ input }) => {
    const { id } = input;
    const productFound = await db.query.product.findFirst({
      where: eq(product.id, id),
      with: {
        business: true,
        images: true,
        category: true,
      },
    });
    if (!productFound) {
      return {
        product: undefined,
      };
    }
    return {
      product: productFound,
    };
  });

export const productsRoute = {
  recentProducts,
  listAllProducts,
  getProductById,
};
