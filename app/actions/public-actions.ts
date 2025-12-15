"use server";

import { cacheLife, cacheTag } from "next/cache";
import * as BusinessDAL from "@/app/data/business/business.dal";
import * as ProductDAL from "@/app/data/product/product.dal";
import { db } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { CategoryDTO } from "../data/category/category.dto";

export async function getPublicBusinessesByCategories(
  category?: CategoryDTO | null,
) {
  const { businesses } = await BusinessDAL.listAllBusinessesByCategories({
    category,
  });

  return businesses;
}

export async function getPublicBusiness(businessId: string) {
  return BusinessDAL.getBusinessById(businessId);
}

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
