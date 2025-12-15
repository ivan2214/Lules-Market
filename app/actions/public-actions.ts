"use server";

import { cacheLife, cacheTag } from "next/cache";
import * as ProductDAL from "@/app/data/product/product.dal";
import { db } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function getPublicProduct(productId: string) {
  return ProductDAL.getProductById(productId);
}

export async function getCategories() {
  "use cache";
  cacheLife("days");
  cacheTag(CACHE_TAGS.CATEGORIES, CACHE_TAGS.PRODUCTS);

  const categories = await db.query.category.findMany();

  return categories;
}
