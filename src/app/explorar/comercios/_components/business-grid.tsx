import { Building, Package, Sparkles } from "lucide-react";
import { PaginationControls } from "@/features/explorar/_components/pagination-controls";
import { BusinessCard } from "@/shared/components/business-card";
import { EmptyStateCustomMessage } from "@/shared/components/empty-state/empty-state-custom-message";
import EmptyStateSearch from "@/shared/components/empty-state/empty-state-search";

import type { BusinessDto } from "@/shared/utils/dto";

export const BusinessGrid = ({
  currentPage,
  hasFilters,
  currentLimit,
  businessesData,
}: {
  currentPage: number;
  hasFilters: boolean;
  currentLimit: number;
  businessesData: {
    businesses: BusinessDto[];
    total: number;
    pages?: number;
    currentPage?: number;
  };
}) => {
  const { businesses, total } = businessesData || {};
  const totalPages = Math.ceil(total / currentLimit);

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
    <section className="mx-auto flex flex-col gap-8">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
        {businesses?.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
      <div className="flex justify-center">
        <PaginationControls totalPages={totalPages} currentPage={currentPage} />
      </div>
    </section>
  );
};
