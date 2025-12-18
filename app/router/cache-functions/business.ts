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
import z from "zod";
import { db } from "@/db";
import {
  business,
  category as categorySchema,
  currentPlan,
  plan,
  product,
} from "@/db/schema";
import type { BusinessWithRelations } from "@/db/types";
import { CACHE_TAGS } from "@/lib/cache-tags";

export const ListAllBusinessesInputSchema = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    sortBy: z.enum(["newest", "oldest"]).optional(),
  })
  .optional();

export const ListAllBusinessesOutputSchema = z.object({
  businesses: z.array(z.custom<BusinessWithRelations>()),
  total: z.number(),
});

export async function listAllBusinessesCache(
  input: z.infer<typeof ListAllBusinessesInputSchema>,
): Promise<z.infer<typeof ListAllBusinessesOutputSchema>> {
  "use cache";
  cacheTag(CACHE_TAGS.BUSINESS.GET_ALL);
  cacheLife("minutes");
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
        },
        category: true,
        logo: true,
      },
      orderBy,
      ...(page && limit ? { offset: (page - 1) * limit, limit: limit } : {}),
    }),
    db.select({ count: count() }).from(business).where(whereClause),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    businesses: businesses as BusinessWithRelations[],
    total,
  };
}

export async function featuredBusinessesCache() {
  "use cache";
  cacheTag(CACHE_TAGS.BUSINESS.GET_FEATURED);
  cacheLife("hours");

  // 1. Obtener IDs ordenados por prioridad del plan y fecha de creación
  const sortedIds = await db
    .select({ id: business.id })
    .from(business)
    .innerJoin(currentPlan, eq(business.id, currentPlan.businessId))
    .innerJoin(plan, eq(currentPlan.planType, plan.type))
    .where(and(eq(business.isActive, true), eq(business.isBanned, false)))
    .orderBy(
      sql`CASE
        WHEN ${plan.type} = 'PREMIUM' THEN 3
        WHEN ${plan.type} = 'BASIC' THEN 2
        WHEN ${plan.type} = 'FREE' THEN 1
        ELSE 0
      END DESC`,
      desc(business.createdAt),
    )
    .limit(6);

  if (sortedIds.length === 0) return [];

  const ids = sortedIds.map((row) => row.id);

  // 2. Obtener data completa usando la API relacional para mantener estructura
  // Nota: Drizzle no garantiza el orden en inArray, así que reordenamos en JS
  const featuredBusinesses = await db.query.business.findMany({
    where: inArray(business.id, ids),
    with: {
      category: true,
      logo: true,
    },
  });

  // 3. Reordenar según el orden de los IDs obtenidos
  const orderedBusinesses = featuredBusinesses.sort((a, b) => {
    return ids.indexOf(a.id) - ids.indexOf(b.id);
  });

  return orderedBusinesses;
}

export async function getBusinessByIdCache(id: string) {
  "use cache";
  cacheTag(CACHE_TAGS.BUSINESS.GET_BY_ID(id));
  cacheLife("hours");

  const businessData = await db.query.business.findFirst({
    where: eq(business.id, id),
    with: {
      category: true,
      logo: true,
      coverImage: true,
      products: {
        where: eq(product.active, true),
        with: {
          images: true,
        },
      },
    },
  });

  return { business: businessData as BusinessWithRelations | undefined };
}

export async function listAllBusinessesByCategoriesCache(input: {
  category: string;
}) {
  "use cache";
  cacheTag(CACHE_TAGS.BUSINESS.GET_ALL);
  cacheLife("hours");

  const categoryId = await db.query.category.findFirst({
    where: eq(categorySchema.value, input.category),
  });

  if (!categoryId) return { businesses: [] };

  const businesses = await db.query.business.findMany({
    where: and(
      eq(business.categoryId, categoryId.id),
      eq(business.isActive, true),
    ),
    limit: 4,
    with: {
      category: true,
      logo: true,
    },
  });
  return { businesses: businesses as BusinessWithRelations[] };
}
