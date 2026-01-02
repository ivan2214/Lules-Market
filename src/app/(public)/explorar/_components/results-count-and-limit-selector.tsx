"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { LimitSelector } from "@/app/(public)/explorar/_components/limit-selector";
import { orpc } from "@/orpc";

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
  const { category, search, sortBy, businessId } = params;
  const {
    data: { businesses, total },
  } = useSuspenseQuery(
    orpc.business.public.listAllBusinesses.queryOptions({
      input: {
        category,
        search,
        sort: sortBy as SortByBusiness,
        limit: currentLimit,
        page: currentPage,
        businessId,
      },
    }),
  );

  const {
    data: { products, total: totalProducts },
  } = useSuspenseQuery(
    orpc.products.public.listAllProducts.queryOptions({
      input: {
        category,
        search,
        sort: sortBy as SortByProduct,
        limit: currentLimit,
        page: currentPage,
        businessId,
      },
    }),
  );

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
        Mostrando {products.length} de {total} productos
      </p>
      <LimitSelector currentLimit={currentLimit} total={totalProducts} />
    </div>
  );
};
