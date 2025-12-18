"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { LimitSelector } from "@/components/shared/limit-selector";
import { orpcTanstack } from "@/lib/orpc";

interface ResultsCountAndLimitSelectorProps {
  typeExplorer: "comercios" | "productos";
  currentLimit: number;
}

export const ResultsCountAndLimitSelector: React.FC<
  ResultsCountAndLimitSelectorProps
> = ({ typeExplorer, currentLimit }) => {
  const {
    data: { businesses, total },
  } = useSuspenseQuery(orpcTanstack.business.listAllBusinesses.queryOptions());

  const {
    data: { products, total: totalProducts },
  } = useSuspenseQuery(orpcTanstack.products.listAllProducts.queryOptions());

  if (typeExplorer === "comercios") {
    <div className="mb-4 flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        Mostrando {businesses.length} de {total} comercios
      </p>
      <LimitSelector currentLimit={currentLimit} total={total} />
    </div>;
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
