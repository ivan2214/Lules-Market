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
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import {
  business,
  currentPlan,
  product,
  category as schemaCategory,
} from "@/db/schema";
import type { ProductWithRelations } from "@/db/types";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";

export const ListAllProductsInputSchema = z
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
  .optional();

export async function listAllProductsCache(
  input: z.infer<typeof ListAllProductsInputSchema>,
) {
  "use cache";
  cacheTag(CACHE_TAGS.PRODUCT.GET_ALL);
  cacheLife("hours");
  const {
    search,
    category,
    businessId,
    page = 1,
    limit = 12,
    sort,
  } = input ?? {};

  // Build where conditions
  const conditions: SQL<unknown>[] = [
    eq(product.active, true),
    eq(product.isBanned, false),
    eq(business.isActive, true),
    eq(business.isBanned, false),
  ];

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

  const prioritySort = sql`CASE
    WHEN ${currentPlan.listPriority} = 'Alta' THEN 3
    WHEN ${currentPlan.listPriority} = 'Media' THEN 2
    WHEN ${currentPlan.listPriority} = 'Estandar' THEN 1
    ELSE 0
  END DESC`;

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
  } else {
    // Default sort: Priority
    orderBy.push(prioritySort);
  }

  orderBy.push(desc(product.createdAt), desc(product.id));

  const [idsResult, totalResult] = await Promise.all([
    db
      .select({ id: product.id })
      .from(product)
      .innerJoin(business, eq(product.businessId, business.id))
      .innerJoin(currentPlan, eq(business.id, currentPlan.businessId))
      .where(whereClause)
      .orderBy(...orderBy)
      .offset((page - 1) * limit)
      .limit(limit),
    db
      .select({ count: count() })
      .from(product)
      .innerJoin(business, eq(product.businessId, business.id))
      .innerJoin(currentPlan, eq(business.id, currentPlan.businessId))
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
    where: inArray(product.id, ids),
    with: {
      business: {
        with: {
          currentPlan: {
            with: {
              plan: true,
            },
          },
          logo: true,
        },
      },
      images: true,
      category: true,
    },
  });

  const orderedProducts = products.sort((a, b) => {
    return ids.indexOf(a.id) - ids.indexOf(b.id);
  });

  return {
    products: orderedProducts as ProductWithRelations[],
    total,
    ...(limit ? { pages: Math.ceil(total / limit) } : {}),
    ...(page ? { currentPage: page } : {}),
  };
}

export async function recentProductsCache() {
  "use cache";
  cacheTag(CACHE_TAGS.PRODUCT.GET_RECENT);
  cacheLife("hours");

  // 1. Obtener IDs ordenados por prioridad del plan del negocio y fecha de creación del producto
  const sortedIds = await db
    .select({ id: product.id })
    .from(product)
    .innerJoin(business, eq(product.businessId, business.id))
    .innerJoin(currentPlan, eq(business.id, currentPlan.businessId))
    .where(
      and(
        eq(product.active, true),
        eq(product.isBanned, false),
        eq(business.isActive, true),
        eq(business.isBanned, false),
      ),
    )
    .orderBy(
      sql`CASE
        WHEN ${currentPlan.listPriority} = 'Alta' THEN 3
        WHEN ${currentPlan.listPriority} = 'Media' THEN 2
        WHEN ${currentPlan.listPriority} = 'Estandar' THEN 1
        ELSE 0
      END DESC`,
      desc(product.createdAt),
    )
    .limit(8);

  if (sortedIds.length === 0) return [];

  const ids = sortedIds.map((row) => row.id);

  // 2. Obtener data completa
  const products = await db.query.product.findMany({
    where: inArray(product.id, ids),
    with: {
      images: true,
      business: {
        with: {
          currentPlan: {
            with: {
              plan: true,
            },
          },
          logo: true,
        },
      },
      category: true,
    },
  });

  // 3. Reordenar
  const orderedProducts = products.sort((a, b) => {
    return ids.indexOf(a.id) - ids.indexOf(b.id);
  });

  return orderedProducts;
}

export async function getSimilarProductsCache(
  categoryId: string,
  currentProductId: string,
) {
  "use cache";
  cacheTag(CACHE_TAGS.PRODUCT.GET_SIMILAR(currentProductId));
  cacheLife("hours");

  const similarIds = await db
    .select({ id: product.id })
    .from(product)
    .innerJoin(business, eq(product.businessId, business.id))
    .innerJoin(currentPlan, eq(business.id, currentPlan.businessId))
    .where(
      and(
        eq(product.active, true),
        eq(product.isBanned, false),
        eq(product.categoryId, categoryId),
        ne(product.id, currentProductId),
        eq(business.isActive, true),
        eq(business.isBanned, false),
      ),
    )
    .orderBy(
      sql`CASE
        WHEN ${currentPlan.listPriority} = 'Alta' THEN 3
        WHEN ${currentPlan.listPriority} = 'Media' THEN 2
        WHEN ${currentPlan.listPriority} = 'Estandar' THEN 1
        ELSE 0
      END DESC`,
      desc(product.createdAt),
    )
    .limit(4);

  if (similarIds.length === 0) return [];

  const ids = similarIds.map((row) => row.id);

  const similar = await db.query.product.findMany({
    where: inArray(product.id, ids),
    with: {
      images: true,
      business: {
        with: {
          currentPlan: {
            with: {
              plan: true,
            },
          },
          logo: true,
        },
      },
      category: true,
    },
  });

  return similar.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
}
