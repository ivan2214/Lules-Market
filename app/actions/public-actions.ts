"use server";

import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { CACHE_TAGS, CACHE_REVALIDATE } from "@/lib/cache-tags";
import { BusinessDAL } from "../data/business/business.dal";
import { ProductDAL } from "../data/product/product.dal";
import type { ProductDTO } from "../data/product/product.dto";

export async function getPublicBusinesses(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const { search, category, page = 1, limit = 12 } = params || {};
  
  return unstable_cache(
    async () => {
      const businessDAL = await BusinessDAL.public();
      const { businesses, total } = await businessDAL.listAllBusinesses({
        search,
        category,
        page,
        limit,
      });

      return {
        businesses,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    },
    [`public-businesses-${search}-${category}-${page}-${limit}`],
    {
      tags: [CACHE_TAGS.PUBLIC_BUSINESSES, CACHE_TAGS.BUSINESSES],
      revalidate: CACHE_REVALIDATE.SHORT,
    }
  )();
}

export async function getPublicProducts(params?: {
  search?: string;
  category?: string;
  businessId?: string;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
}): Promise<{
  products: ProductDTO[];
  total: number;
  pages: number;
  currentPage: number;
}> {
  const {
    search,
    category,
    businessId,
    page = 1,
    limit = 12,
    sort,
  } = params || {};
  
  return unstable_cache(
    async () => {
      const productDAL = await ProductDAL.public();
      const { products, total, pages, currentPage } =
        await productDAL.listAllProducts({
          search,
          category,
          businessId,
          page,
          limit,
          sort,
        });

      return {
        products,
        total,
        pages,
        currentPage,
      };
    },
    [`public-products-${search}-${category}-${businessId}-${page}-${limit}-${sort}`],
    {
      tags: [CACHE_TAGS.PUBLIC_PRODUCTS, CACHE_TAGS.PRODUCTS, businessId ? CACHE_TAGS.businessById(businessId) : ''].filter(Boolean),
      revalidate: CACHE_REVALIDATE.SHORT,
    }
  )();
}

export async function getPublicBusiness(businessId: string) {
  return unstable_cache(
    async () => {
      const businessDAL = await BusinessDAL.public();
      const business = await businessDAL.getBusinessById(businessId);
      return business;
    },
    [`public-business-${businessId}`],
    {
      tags: [CACHE_TAGS.PUBLIC_BUSINESSES, CACHE_TAGS.BUSINESSES, CACHE_TAGS.businessById(businessId)],
      revalidate: CACHE_REVALIDATE.MEDIUM,
    }
  )();
}

export async function getPublicProduct(productId: string) {
  return unstable_cache(
    async () => {
      const productDAL = await ProductDAL.public();
      const product = await productDAL.getProductById(productId);
      return product;
    },
    [`public-product-${productId}`],
    {
      tags: [CACHE_TAGS.PUBLIC_PRODUCTS, CACHE_TAGS.PRODUCTS, CACHE_TAGS.productById(productId)],
      revalidate: CACHE_REVALIDATE.MEDIUM,
    }
  )();
}

export async function getCategories() {
  return unstable_cache(
    async () => {
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
    },
    ['categories'],
    {
      tags: [CACHE_TAGS.CATEGORIES, CACHE_TAGS.PRODUCTS],
      revalidate: CACHE_REVALIDATE.LONG,
    }
  )();
}
