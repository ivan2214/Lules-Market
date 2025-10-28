"use server";

import { cacheLife, cacheTag } from "next/cache";
import * as BusinessDAL from "@/app/data/business/business.dal";
import * as ProductDAL from "@/app/data/product/product.dal";
import { CACHE_TAGS } from "@/lib/cache-tags";
import prisma from "@/lib/prisma";

export async function getPublicBusinesses(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const { search, category, page = 1, limit = 12 } = params || {};

  // Llamar directamente a la función del DAL
  return BusinessDAL.listAllBusinesses({
    search,
    category,
    page,
    limit,
  });
}

export async function getPublicProducts(params?: {
  search?: string;
  category?: string;
  businessId?: string;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
}) {
  const {
    search,
    category,
    businessId,
    page = 1,
    limit = 12,
    sort,
  } = params || {};

  // Llamar directamente a la función del DAL
  return ProductDAL.listAllProducts({
    search,
    category,
    businessId,
    page,
    limit,
    sort,
  });
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

  const categories = await prisma.product.findMany({
    where: {
      active: true,
      category: { not: null },
      business: {
        planStatus: "ACTIVE",
      },
    },
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  return categories.map((c) => c.category).filter(Boolean) as string[];
}
