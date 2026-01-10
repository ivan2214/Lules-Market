import "server-only";
import { db } from "@/db";
import { CACHE_KEYS, CACHE_TTL, getCachedOrFetch } from "@/lib/cache";

async function fetchAllCategories() {
  const categories = await db.query.category.findMany({
    with: {
      products: true,
    },
  });

  return categories;
}

export async function listAllCategoriesCache() {
  return getCachedOrFetch(
    CACHE_KEYS.CATEGORIES_ALL,
    fetchAllCategories,
    CACHE_TTL.CATEGORIES,
  );
}
