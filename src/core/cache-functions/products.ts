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
import { z } from "zod";
import { db } from "@/db";
import {
  business as businessSchema,
  category as categoryShema,
  currentPlan as currentPlanSchema,
  product as productSchema,
} from "@/db/schema";
import type { ProductWithRelations } from "@/db/types";
import {
  CACHE_KEYS,
  CACHE_TTL,
  generateCacheKey,
  getCachedOrFetch,
} from "@/lib/cache";

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

type ListAllProductsResult = {
  products: ProductWithRelations[];
  total: number;
  pages?: number;
  currentPage?: number;
};

async function fetchAllProducts(
  input: z.infer<typeof ListAllProductsInputSchema>,
): Promise<ListAllProductsResult> {
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

    categoryDB && conditions.push(eq(productSchema.categoryId, categoryDB?.id));
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
    // Default sort: Priority
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

export async function listAllProductsCache(
  input: z.infer<typeof ListAllProductsInputSchema>,
): Promise<ListAllProductsResult> {
  const cacheKey = generateCacheKey("products:list", input ?? {});

  return getCachedOrFetch(
    cacheKey,
    () => fetchAllProducts(input),
    CACHE_TTL.PRODUCTS_LIST,
  );
}

async function fetchRecentProducts(): Promise<ProductWithRelations[]> {
  // 1. Obtener IDs ordenados por prioridad del plan del negocio y fecha de creación del producto
  const sortedIds = await db
    .select({ id: productSchema.id })
    .from(productSchema)
    .innerJoin(businessSchema, eq(productSchema.businessId, businessSchema.id))
    .innerJoin(
      currentPlanSchema,
      eq(businessSchema.id, currentPlanSchema.businessId),
    )
    .where(
      and(eq(productSchema.active, true), eq(businessSchema.isActive, true)),
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

  // 2. Obtener data completa
  const products = await db.query.product.findMany({
    where: inArray(productSchema.id, ids),
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

  return orderedProducts as ProductWithRelations[];
}

export async function recentProductsCache(): Promise<ProductWithRelations[]> {
  return getCachedOrFetch(
    CACHE_KEYS.PRODUCTS_RECENT,
    fetchRecentProducts,
    CACHE_TTL.PRODUCTS_RECENT,
  );
}

async function fetchSimilarProducts(
  categoryId: string,
  currentProductId: string,
): Promise<ProductWithRelations[]> {
  const similarIds = await db
    .select({ id: productSchema.id })
    .from(productSchema)
    .innerJoin(businessSchema, eq(productSchema.businessId, businessSchema.id))
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

  return similar.sort(
    (a, b) => ids.indexOf(a.id) - ids.indexOf(b.id),
  ) as ProductWithRelations[];
}

export async function getSimilarProductsCache(
  categoryId: string,
  currentProductId: string,
): Promise<ProductWithRelations[]> {
  const cacheKey = CACHE_KEYS.productsSimilar(categoryId, currentProductId);

  return getCachedOrFetch(
    cacheKey,
    () => fetchSimilarProducts(categoryId, currentProductId),
    CACHE_TTL.PRODUCTS_SIMILAR,
  );
}

async function fetchProductById(
  id: string,
): Promise<{ product: ProductWithRelations | undefined }> {
  const productFound = await db.query.product.findFirst({
    where: eq(productSchema.id, id),
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

  return { product: productFound as ProductWithRelations | undefined };
}

export async function getProductByIdCache(
  id: string,
): Promise<{ product: ProductWithRelations | undefined }> {
  return getCachedOrFetch(
    CACHE_KEYS.product(id),
    () => fetchProductById(id),
    CACHE_TTL.PRODUCT_BY_ID,
  );
}
