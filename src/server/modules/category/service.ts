import "server-only";
import { db } from "@/db";
import { CACHE_KEYS, CACHE_TTL, getCachedOrFetch } from "@/lib/cache";

export abstract class CategoryService {
  static async listAll() {
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
  }
}
