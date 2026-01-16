import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { BusinessService } from "@/server/modules/business/service";
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

  const data = await BusinessService.listAll({
    category,
    limit: currentLimit,
    page: currentPage,
    search,
    sortBy,
  });

  return {
    ...data,
    businesses: data.businesses.map(toBusinessDto),
  };
}

export async function getFeaturedBusinesses() {
  "use cache";
  cacheTag("businesses");
  cacheLife("hours");
  const data = await BusinessService.getFeatured();
  return data.map(toBusinessDto);
}

export async function getBusinessById(id: string) {
  "use cache";
  cacheTag("businesses");
  cacheLife("hours");
  const { business } = await BusinessService.getById(id);
  return business ? toBusinessDto(business) : null;
}

export async function getSimilarBusinesses(params: {
  category: string;
  businessId: string;
  limit?: number;
}) {
  "use cache";
  cacheTag("businesses");
  cacheLife("days");
  const { businesses } = await BusinessService.listSimilar({
    category: params.category,
    businessId: params.businessId,
    limit: params.limit,
  });
  return (businesses || []).map(toBusinessDto);
}

// Optimizado: Solo trae IDs y con un límite razonable
export const getBusinessIds = cache(async (limit: number = 100) => {
  const businesses = await db.query.business.findMany({
    limit: limit,
    columns: { id: true }, // ⚡ MUCHO más rápido
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });
  return businesses.map((b) => ({ id: b.id }));
});

export async function getBusinessProducts(businessId: string) {
  "use cache";
  cacheTag("businesses");
  cacheLife("minutes");
  const data = await BusinessService.getMyProducts(businessId, 50, 0);
  return data.map(toProductDto);
}
