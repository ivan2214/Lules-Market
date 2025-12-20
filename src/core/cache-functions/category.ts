import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";

export async function listAllCategoriesCache() {
  "use cache";
  cacheTag(CACHE_TAGS.CATEGORY.GET_ALL);
  cacheLife("hours");
  const categories = await db.query.category.findMany({
    with: {
      products: true,
    },
  });

  return categories;
}
