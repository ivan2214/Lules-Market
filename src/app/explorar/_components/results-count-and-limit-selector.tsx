"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { LimitSelector } from "@/features/explorar/_components/limit-selector";
import { api } from "@/lib/eden";

type SortByProduct = "price_asc" | "price_desc" | "name_asc" | "name_desc";
type SortByBusiness = "newest" | "oldest";

type Params = {
  search?: string;
  sortBy?: SortByProduct | SortByBusiness;
  category?: string;
  page?: string;
  limit?: string;
  businessId?: string;
};

interface ResultsCountAndLimitSelectorProps {
  typeExplorer: "comercios" | "productos";
  currentLimit: number;
  currentPage: number;
  params: Params;
}

export const ResultsCountAndLimitSelector: React.FC<
  ResultsCountAndLimitSelectorProps
> = ({ typeExplorer, currentLimit, currentPage, params }) => {
  const { category, search, sortBy, businessId, limit, page } = params;
  const { data } = useSuspenseQuery({
    queryKey: ["businesses", category, limit, page, search, sortBy],
    queryFn: async () => {
      const { data } = await api.business.public["list-all"].get({
        query: {
          category: params?.category,
          limit: currentLimit,
          page: currentPage,
          search,
          sortBy: sortBy as SortByBusiness,
        },
      });
      return data;
    },
  });

  const businesses = data?.businesses || [];
  const total = data?.total || 0;

  const { data: dataP } = useSuspenseQuery({
    queryKey: [
      "products",
      { businessId, category, limit, page, search, sortBy },
    ],
    queryFn: async () => {
      const { data } = await api.products.public.list.get({
        query: {
          category,
          search,
          sort: sortBy as SortByProduct,
          limit: currentLimit,
          page: currentPage,
          businessId,
        },
      });
      return data;
    },
  });

  const products = dataP?.products || [];
  const totalProducts = dataP?.total || 0;

  if (typeExplorer === "comercios") {
    return (
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando {businesses.length} de {total} comercios
        </p>
        <LimitSelector currentLimit={currentLimit} total={total} />
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        Mostrando {products.length} de {totalProducts} productos
      </p>
      <LimitSelector currentLimit={currentLimit} total={totalProducts} />
    </div>
  );
};
