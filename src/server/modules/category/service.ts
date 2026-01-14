import "server-only";
import { db } from "@/db";
import { CACHE_KEYS, CACHE_TTL, getCachedOrFetch } from "@/lib/cache";

export const CategoryService = {
  async listAll() {
    return getCachedOrFetch(
      CACHE_KEYS.CATEGORIES_ALL,
      async () => {
        const categories = await db.query.category.findMany({
          with: {
            products: true,
          },
        });
        return categories;
      },
      CACHE_TTL.CATEGORIES,
    );
  },
};
