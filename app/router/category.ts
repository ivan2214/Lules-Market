import "server-only";
import { os } from "@orpc/server";
import { cacheLife, cacheTag } from "next/cache";
import z from "zod";
import { db } from "@/db";
import type { CategoryWithRelations } from "@/db/types";
import { CACHE_TAGS } from "@/lib/cache-tags";

async function listAllCategoriesCache() {
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

export const listAllCategories = os
  .route({
    method: "GET",
    description: "Listar todas las categorías",
    summary: "Listar todas las categorías",
    tags: ["Categorías"],
    outputStructure: "compact",
  })
  .output(z.array(z.custom<CategoryWithRelations>()))
  .handler(async () => {
    const categories = await listAllCategoriesCache();

    return categories;
  });

export const categoryRoute = {
  listAllCategories,
};
