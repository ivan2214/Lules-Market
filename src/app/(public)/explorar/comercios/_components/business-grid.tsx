"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building, Package, Sparkles } from "lucide-react";
import { PaginationControls } from "@/app/(public)/explorar/_components/pagination-controls";
import { api } from "@/lib/eden";
import { BusinessCard } from "@/shared/components/business-card";
import { EmptyStateCustomMessage } from "@/shared/components/empty-state/empty-state-custom-message";
import EmptyStateSearch from "@/shared/components/empty-state/empty-state-search";

export const BusinessGrid = ({
  currentPage,
  hasFilters,
  currentLimit,
  search,
  category,
  sortBy,
}: {
  currentPage: number;
  hasFilters: boolean;
  currentLimit: number;
  search?: string;
  category?: string;
  sortBy?: "newest" | "oldest";
}) => {
  const { data } = useSuspenseQuery({
    queryKey: [
      "businesses",
      category,
      currentLimit,
      currentPage,
      search,
      sortBy,
    ],
    queryFn: async () => {
      const { data } = await api.business.public["list-all"].get({
        query: {
          category,
          limit: currentLimit,
          page: currentPage,
          search,
          sortBy,
        },
      });
      return data;
    },
  });

  const { businesses, total } = data || {};
  const totalPages = Math.ceil(total || 0 / currentLimit);

  if (!businesses?.length || !total || !businesses) {
    hasFilters ? (
      <EmptyStateSearch
        title="No se encontraron comercios"
        description="Por favor, intenta con otros filtros."
        typeExplorer="comercios"
        className="mx-auto"
      />
    ) : (
      <EmptyStateCustomMessage
        title="No hay comercios"
        description="Registra tu primer comercio"
        className="mx-auto"
        icons={[Building, Sparkles, Package]}
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        {businesses?.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
};
