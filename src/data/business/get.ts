import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { api } from "@/lib/eden";
import { toBusinessDto, toProductDto } from "@/shared/utils/dto";

type SearchParams = {
  search?: string;
  sortBy?: "newest" | "oldest";
  category?: string;
  page?: string;
  limit?: string;
};

export async function listAllBusiness(params?: SearchParams | null) {
  "use cache";
  cacheTag("businesses");
  cacheLife("minutes");
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
}

export async function getFeaturedBusinesses() {
  "use cache";
  cacheTag("businesses");
  cacheLife("hours");
  const { data, error } = await api.business.public.featured.get();
  if (error) throw error;
  return data.map(toBusinessDto);
}

export async function getBusinessById(id: string) {
  "use cache";
  cacheTag("businesses");
  cacheLife("hours");
  const { data, error } = await api.business.public["get-business-by-id"].get({
    query: { id },
  });
  if (error) throw error;

  return data.business ? toBusinessDto(data.business) : null;
}

export async function getSimilarBusinesses(params: {
  category: string;
  businessId: string;
  limit?: number;
}) {
  "use cache";
  cacheTag("businesses");
  cacheLife("days");
  const { data, error } = await api.business.public["list-similar"].get({
    query: {
      category: params.category,
      businessId: params.businessId,
      limit: params.limit,
    },
  });
  if (error) throw error;
  return (data.businesses || []).map(toBusinessDto);
}

/**
 * Specifically for generateStaticParams
 */
export const getBusinessIds = cache(async () => {
  const businesses = await db.query.business.findMany();
  return businesses.map((b) => ({ id: b.id }));
});

export const getBusinessProducts = cache(async (headers: Headers) => {
  const { data, error } = await api.business.private["my-products"].get({
    headers,
  });
  if (error) {
    console.log(error);

    throw new Error("Error obteniendo productos");
  }
  return data.map(toProductDto);
});
