import "server-only";
import { db } from "@/db";

export async function listAllCategoriesCache() {
  const categories = await db.query.category.findMany({
    with: {
      products: true,
    },
  });

  return categories;
}
