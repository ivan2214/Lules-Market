import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { api } from "@/lib/eden";
import { toProductDto } from "@/shared/utils/dto";

type SearchParams = {
  search?: string;
  category?: string;
  businessId?: string;
  page?: string;
  limit?: string;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

export async function listAllProducts(searchParams?: SearchParams) {
  "use cache";
  cacheTag("products");
  cacheLife("minutes");
  const { limit, page, search, sortBy, category, businessId } =
    searchParams || {};
  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;

  const { data, error } = await api.products.public.list.get({
    query: {
      businessId,
      category,
      limit: currentLimit,
      page: currentPage,
      search,
      sort: sortBy,
    },
  });

  if (error) throw error;

  return {
    ...data,
    products: data.products.map(toProductDto),
  };
}

export async function getRecentProducts() {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  const { data, error } = await api.products.public.recent.get();
  if (error) throw error;
  return data.products.map(toProductDto);
}

export async function getProductById(id: string) {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  const { data, error } = await api.products.public({ id }).get();
  if (error) throw error;
  return data.product ? toProductDto(data.product) : null;
}

export async function getSimilarProducts(params: {
  productId: string;
  limit?: number;
}) {
  "use cache";
  cacheTag("products");
  cacheLife("days");
  const { data, error } = await api.products
    .public({ id: params.productId })
    .similar.get();
  if (error) throw error.value.message;
  return data.products.map(toProductDto);
}

/**
 * Specifically for generateStaticParams
 */
export const getProductIds = cache(async () => {
  const products = await db.query.product.findMany();
  return products.map((p) => ({ id: p.id }));
});
