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
