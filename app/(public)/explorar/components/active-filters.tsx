"use client";

import Link from "next/link";
import type { Business } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createSearchUrl } from "@/lib/utils";

type ActiveFiltersProps = {
  params: {
    search?: string;
    category?: string;
    page?: string;
    businessId?: string;
    sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
  };
  businesses: Business[];
};

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  params,
  businesses,
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Filtros activos:</span>
      {params.search && (
        <Badge variant="secondary">
          Búsqueda: {params.search}
          <Link
            href={createSearchUrl(params, { search: undefined })}
            className="ml-2"
          >
            ×
          </Link>
        </Badge>
      )}
      {params.category && (
        <Badge variant="secondary">
          Categoría: {params.category}
          <Link
            href={createSearchUrl(params, { category: undefined })}
            className="ml-2"
          >
            ×
          </Link>
        </Badge>
      )}
      {params.businessId && (
        <Badge variant="secondary">
          Negocio:{" "}
          {businesses.find((b) => b.id === params.businessId)?.name ||
            params.businessId}
          <Link
            href={createSearchUrl(params, { businessId: undefined })}
            className="ml-2"
          >
            ×
          </Link>
        </Badge>
      )}
      {params.sort && (
        <Badge variant="secondary">
          Ordenamiento:{" "}
          {params.sort === "price_asc"
            ? "Precio: Menor a Mayor"
            : params.sort === "price_desc"
              ? "Precio: Mayor a Menor"
              : params.sort === "name_asc"
                ? "Nombre: A-Z"
                : "Nombre: Z-A"}
          <Link
            href={createSearchUrl(params, { sort: undefined })}
            className="ml-2"
          >
            ×
          </Link>
        </Badge>
      )}
      {(params.search ||
        params.category ||
        params.businessId ||
        params.sort) && (
        <Button variant="ghost" size="sm" asChild className="ml-auto">
          <Link href="/explorar">Limpiar todos</Link>
        </Button>
      )}
    </div>
  );
};
