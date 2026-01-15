import "server-only";
import { cache } from "react";
import { api } from "@/lib/eden";
import { toBusinessDto } from "@/shared/utils/dto";

type SearchParams = {
  search?: string;
  sortBy?: "newest" | "oldest";
  category?: string;
  page?: string;
  limit?: string;
};

export const listAllBusiness = cache(async (params?: SearchParams | null) => {
  const { limit, page, search, sortBy, category } = params || {};

  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;

  const { data, error } = await api.business.public["list-all"].get({
    query: {
      category,
      limit: currentLimit,
      page: currentPage,
      search,
      sortBy,
    },
  });

  if (error) throw error;

  return {
    ...data,
    businesses: data.businesses.map(toBusinessDto),
  };
});

export const getFeaturedBusinesses = cache(async () => {
  const { data, error } = await api.business.public.featured.get();
  if (error) throw error;
  return data.map(toBusinessDto);
});

export const getBusinessById = cache(async (id: string) => {
  const { data, error } = await api.business.public["get-business-by-id"].get({
    query: { id },
  });
  if (error) throw error;
  return data.business ? toBusinessDto(data.business) : null;
});

export const getSimilarBusinesses = cache(
  async (params: { category: string; businessId: string; limit?: number }) => {
    const { data, error } = await api.business.public["list-similar"].get({
      query: {
        category: params.category,
        businessId: params.businessId,
        limit: params.limit,
      },
    });
    if (error) throw error;
    return (data.businesses || []).map(toBusinessDto);
  },
);

/**
 * Specifically for generateStaticParams
 */
export const getBusinessIds = cache(async () => {
  const { data, error } = await api.business.public["list-all"].get({
    query: { limit: 100 },
  });
  if (error) throw error;
  return data.businesses.map((b) => ({ id: b.id }));
});

export const getBusinessProducts = cache(async (headers: Headers) => {
  const { data, error } = await api.business.private["my-products"].get({
    headers,
  });
  if (error) {
    console.log(error);

    throw new Error("Error obteniendo produtos");
  }
  return data;
});
