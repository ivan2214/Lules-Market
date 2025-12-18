import "server-only";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
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
  plan,
  product,
  category as schemaCategory,
} from "@/db/schema";
import type { ProductWithRelations } from "@/db/types";
import { CACHE_TAGS } from "@/lib/cache-tags";

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
    .innerJoin(plan, eq(currentPlan.planType, plan.type))
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
        WHEN ${plan.type} = 'PREMIUM' THEN 3
        WHEN ${plan.type} = 'BASIC' THEN 2
        WHEN ${plan.type} = 'FREE' THEN 1
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
      business: true,
      category: true,
    },
  });

  // 3. Reordenar
  const orderedProducts = products.sort((a, b) => {
    return ids.indexOf(a.id) - ids.indexOf(b.id);
  });

  return orderedProducts;
}
