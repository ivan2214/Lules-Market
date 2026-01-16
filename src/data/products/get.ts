import { api } from "@/lib/eden";
import "server-only";
import { cache } from "react";
import { db } from "@/db";
import { toProductDto } from "@/shared/utils/dto";

type SearchParams = {
  search?: string;
  category?: string;
  businessId?: string;
  page?: string;
  limit?: string;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

export const listAllProducts = cache(async (searchParams?: SearchParams) => {
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
});

export const getRecentProducts = cache(async () => {
  const { data, error } = await api.products.public.recent.get();
  if (error) throw error;
  return data.products.map(toProductDto);
});

export const getProductById = cache(async (id: string) => {
  const { data, error } = await api.products.public({ id }).get();
  if (error) throw error;
  return data.product ? toProductDto(data.product) : null;
});

export const getSimilarProducts = cache(
  async (params: { productId: string; limit?: number }) => {
    const { data, error } = await api.products
      .public({ id: params.productId })
      .similar.get();
    if (error) throw error.value.message;
    return data.products.map(toProductDto);
  },
);

/**
 * Specifically for generateStaticParams
 */
export const getProductIds = cache(async () => {
  const products = await db.query.product.findMany();
  return products.map((p) => ({ id: p.id }));
});
