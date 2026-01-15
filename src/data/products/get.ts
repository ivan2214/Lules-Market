import { api } from "@/lib/eden";
import "server-only";

type SearchParams = {
  search?: string;
  category?: string;
  businessId?: string;
  page?: string;
  limit?: string;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
};

export const listAllProducts = async (searchParams?: SearchParams) => {
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
  return data;
};
