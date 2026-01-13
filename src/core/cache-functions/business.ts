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
import { type Static, t } from "elysia";
import { db } from "@/db";
import { models } from "@/db/model";
import {
  business,
  category as categorySchema,
  currentPlan as currentPlanSchema,
  plan,
  product,
} from "@/db/schema";
import type { BusinessWithRelations } from "@/db/types";
import {
  CACHE_KEYS,
  CACHE_TTL,
  generateCacheKey,
  getCachedOrFetch,
} from "@/lib/cache";

export const ListAllBusinessesInputSchema = t.Optional(
  t.Object({
    search: t.Optional(t.String()),
    category: t.Optional(t.String()),
    page: t.Optional(t.Number()),
    limit: t.Optional(t.Number()),
    sortBy: t.Optional(t.Union([t.Literal("newest"), t.Literal("oldest")])),
  }),
);

export const ListAllBusinessesOutputSchema = t.Object({
  businesses: t.Array(models.relations.businessWithRelations),
  total: t.Number(),
});

type ListAllBusinessesResult = Static<typeof ListAllBusinessesOutputSchema>;

async function fetchAllBusinesses(
  input?: Static<typeof ListAllBusinessesInputSchema> | null,
): Promise<ListAllBusinessesResult> {
  const { search, category, page = 1, limit = 12, sortBy } = input ?? {};

  // Build where conditions
  const conditions: SQL<unknown>[] = [eq(business.isActive, true)];

  if (search) {
    conditions.push(
      or(
        ilike(business.name, `%${search}%`),
        ilike(business.description, `%${search}%`),
      ) as SQL<string>,
    );
  }

  if (category) {
    const categoryDB = await db.query.category.findFirst({
      where: eq(categorySchema.value, category),
    });

    categoryDB && conditions.push(eq(business.categoryId, categoryDB.id));
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
    orderBy.push(asc(business.createdAt));
  } else if (sortBy === "newest") {
    orderBy.push(desc(business.createdAt));
  } else {
    // Default sort: Priority
    orderBy.push(prioritySort);
  }

  orderBy.push(desc(business.createdAt), desc(business.id));

  const [idsResult, totalResult] = await Promise.all([
    db
      .select({ id: business.id })
      .from(business)
      .innerJoin(
        currentPlanSchema,
        eq(business.id, currentPlanSchema.businessId),
      )
      .where(whereClause)
      .orderBy(...orderBy)
      .offset((page - 1) * limit)
      .limit(limit),
    db
      .select({ count: count() })
      .from(business)
      .innerJoin(
        currentPlanSchema,
        eq(business.id, currentPlanSchema.businessId),
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
    where: inArray(business.id, ids),
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
}

export async function listAllBusinessesCache(
  input?: Static<typeof ListAllBusinessesInputSchema> | null,
): Promise<ListAllBusinessesResult> {
  const cacheKey = generateCacheKey("businesses:list", input ?? {});

  return getCachedOrFetch(
    cacheKey,
    () => fetchAllBusinesses(input),
    CACHE_TTL.BUSINESSES_LIST,
  );
}

async function fetchFeaturedBusinesses(): Promise<BusinessWithRelations[]> {
  // 1. Obtener IDs ordenados por prioridad del plan y fecha de creación
  const sortedIds = await db
    .select({ id: business.id })
    .from(business)
    .innerJoin(currentPlanSchema, eq(business.id, currentPlanSchema.businessId))
    .innerJoin(plan, eq(currentPlanSchema.planType, plan.type))
    .where(and(eq(business.isActive, true)))
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

  return orderedBusinesses as BusinessWithRelations[];
}

export async function featuredBusinessesCache(): Promise<
  BusinessWithRelations[]
> {
  return getCachedOrFetch(
    CACHE_KEYS.BUSINESSES_FEATURED,
    fetchFeaturedBusinesses,
    CACHE_TTL.BUSINESSES_FEATURED,
  );
}

async function fetchBusinessById(
  id: string,
): Promise<{ business: BusinessWithRelations | undefined }> {
  const businessData = await db.query.business.findFirst({
    where: eq(business.id, id),
    with: {
      category: true,
      logo: true,
      coverImage: true,
      products: {
        where: eq(product.active, true),
        limit: 12, // Limit to prevent payload issues
        orderBy: desc(product.createdAt),
        with: {
          images: true,
        },
      },
    },
  });

  return { business: businessData as BusinessWithRelations | undefined };
}

export async function getBusinessByIdCache(
  id: string,
): Promise<{ business: BusinessWithRelations | undefined }> {
  return getCachedOrFetch(
    CACHE_KEYS.business(id),
    () => fetchBusinessById(id),
    CACHE_TTL.BUSINESS_BY_ID,
  );
}

async function fetchSimilarBusinesses(input: {
  category: string;
  businessId: string;
}): Promise<{ businesses: BusinessWithRelations[] }> {
  const categoryId = await db.query.category.findFirst({
    where: eq(categorySchema.value, input.category),
  });

  if (!categoryId) return { businesses: [] };

  const businesses = await db.query.business.findMany({
    where: and(
      eq(business.categoryId, categoryId.id),
      eq(business.isActive, true),
      // todos menos el negocio que se esta viendo
      not(eq(business.id, input.businessId)),
    ),
    limit: 4,
    with: {
      category: true,
      logo: true,
    },
  });

  return { businesses: businesses as BusinessWithRelations[] };
}

export async function listAllSimilarBusinessesCache(input: {
  category: string;
  businessId: string;
}): Promise<{ businesses: BusinessWithRelations[] }> {
  const cacheKey = CACHE_KEYS.businessesSimilar(
    input.category,
    input.businessId,
  );

  return getCachedOrFetch(
    cacheKey,
    () => fetchSimilarBusinesses(input),
    CACHE_TTL.BUSINESSES_SIMILAR,
  );
}

// Para generateStaticParams - Cache larga (1 hora o más)
export async function getAllBusinessIdsCache(): Promise<{ id: string }[]> {
  return getCachedOrFetch(
    "businesses:static-ids", // Key estática simple
    async () => {
      return await db.query.business.findMany({
        where: eq(business.isActive, true),
        columns: { id: true },
        orderBy: desc(business.createdAt),
        limit: 50,
      });
    },
    CACHE_TTL.PLANS, // Usar TTL largo (1 hora)
  );
}
