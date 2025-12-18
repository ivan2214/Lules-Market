"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Building, Package, Sparkles } from "lucide-react";
import { EmptyStateCustomMessage } from "@/components/empty-state/empty-state-custom-message";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { orpcTanstack } from "@/lib/orpc";
import { BusinessCard } from "./business-card";

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
  const {
    data: { businesses, total },
  } = useSuspenseQuery(
    orpcTanstack.business.listAllBusinesses.queryOptions({
      input: {
        limit: currentLimit,
        page: currentPage,
        search,
        category,
        sortBy,
      },
    }),
  );
  const totalPages = Math.ceil(total / currentLimit);

  if (!businesses.length) {
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
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
};
