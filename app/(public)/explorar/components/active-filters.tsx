"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleRemoveFilter = (filterKey: string) => {
    const newUrl = createSearchUrl(params, { [filterKey]: undefined });
    router.push(newUrl);
  };

  const handleClearAll = () => {
    router.push("/explorar");
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Filtros activos:</span>
      {params.search && (
        <Badge variant="secondary" className="gap-1.5">
          <span>Búsqueda: {params.search}</span>
          <Button
            type="button"
            onClick={() => handleRemoveFilter("search")}
            aria-label="Eliminar filtro de búsqueda"
            variant={"ghost"}
            size={"icon"}
            className="ml-2 h-6 w-6 rounded-full transition-colors hover:bg-muted"
          >
            <X className="h-3 w-3 rounded-full text-destructive hover:rounded-full" />
          </Button>
        </Badge>
      )}
      {params.category && (
        <Badge variant="secondary" className="gap-1.5">
          <span>Categoría: {params.category}</span>
          <Button
            type="button"
            onClick={() => handleRemoveFilter("category")}
            aria-label="Eliminar filtro de categoría"
            variant={"ghost"}
            size={"icon"}
            className="ml-2 h-6 w-6 rounded-full transition-colors hover:bg-muted"
          >
            <X className="h-3 w-3 rounded-full text-destructive hover:rounded-full" />
          </Button>
        </Badge>
      )}
      {params.businessId && (
        <Badge variant="secondary" className="gap-1.5">
          <span>
            Negocio:{" "}
            {businesses.find((b) => b.id === params.businessId)?.name ||
              params.businessId}
          </span>
          <Button
            type="button"
            onClick={() => handleRemoveFilter("businessId")}
            aria-label="Eliminar filtro de negocio"
            variant={"ghost"}
            size={"icon"}
            className="ml-2 h-6 w-6 rounded-full transition-colors hover:bg-muted"
          >
            <X className="h-3 w-3 rounded-full text-destructive hover:rounded-full" />
          </Button>
        </Badge>
      )}
      {params.sort && (
        <Badge variant="secondary" className="gap-1.5">
          <span>
            Ordenamiento:{" "}
            {params.sort === "price_asc"
              ? "Precio: Menor a Mayor"
              : params.sort === "price_desc"
                ? "Precio: Mayor a Menor"
                : params.sort === "name_asc"
                  ? "Nombre: A-Z"
                  : "Nombre: Z-A"}
          </span>
          <Button
            type="button"
            onClick={() => handleRemoveFilter("sort")}
            aria-label="Eliminar ordenamiento"
            variant={"ghost"}
            size={"icon"}
            className="ml-2 h-6 w-6 rounded-full transition-colors hover:bg-muted"
          >
            <X className="h-3 w-3 rounded-full text-destructive hover:rounded-full" />
          </Button>
        </Badge>
      )}
      {(params.search ||
        params.category ||
        params.businessId ||
        params.sort) && (
        <Button
          size="sm"
          onClick={handleClearAll}
          variant={"destructive"}
          className="ml-auto"
        >
          Limpiar todos
        </Button>
      )}
    </div>
  );
};
