"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { api } from "@/lib/eden";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { type TypeExplorer, useSearchUrl } from "@/shared/hooks/use-search-url";

type SortByBusiness = "newest" | "oldest";
type SortByProduct = "price_asc" | "price_desc" | "name_asc" | "name_desc";

type Params = {
  search?: string;
  sortBy?: SortByBusiness | SortByProduct;
  category?: string;
  page?: string;
  limit?: string;
  businessId?: string;
};

type ActiveFiltersProps = {
  params: Params;

  typeExplorer: TypeExplorer;
};

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  params,

  typeExplorer,
}) => {
  const { data } = useSuspenseQuery({
    queryKey: ["businesses", params?.category],
    queryFn: async () => {
      const { data } = await api.business.public["list-all"].get({
        query: {
          category: params?.category,
        },
      });
      return data;
    },
  });

  const businesses = data?.businesses || [];
  const router = useRouter();
  const { createUrl } = useSearchUrl({ currentParams: params, typeExplorer });

  // Etiquetas legibles para cada parámetro
  const labels: Record<string, (value: string) => string> = {
    search: (v) => `Búsqueda: ${v}`,
    category: (v) => `Categoría: ${v}`,
    businessId: (v) =>
      `Negocio: ${businesses.find((b) => b.id === v)?.name || v}`,
    sortBy: (v) =>
      ({
        price_asc: "Precio: Menor a Mayor",
        price_desc: "Precio: Mayor a Menor",
        name_asc: "Nombre: A-Z",
        name_desc: "Nombre: Z-A",
      })[v] || v,
    limit: (v) => `Límite: ${v}`,
    page: (v) => `Página: ${v}`,
  };

  const handleRemoveFilter = (key: string) => {
    router.push(createUrl({ [key]: undefined }) as Route);
  };

  const handleClearAll = () => {
    router.push(`/explorar/${typeExplorer}`);
  };

  // Filtrar solo los parámetros que tienen valor
  const activeParams = Object.entries(params).filter(([_, value]) => value);

  if (!activeParams.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-muted-foreground text-sm">Filtros activos:</span>

      {activeParams.map(([key, value]) => (
        <Badge key={key} variant="secondary" className="gap-1.5">
          <span>{value && labels[key]?.(value)}</span>
          <Button
            type="button"
            onClick={() => handleRemoveFilter(key)}
            aria-label={`Eliminar filtro ${key}`}
            variant="ghost"
            size="icon"
            className="ml-2 h-6 w-6 rounded-full transition hover:bg-muted"
          >
            <X className="h-3 w-3 text-destructive" />
          </Button>
        </Badge>
      ))}

      {activeParams.length > 0 && (
        <Button
          size="sm"
          onClick={handleClearAll}
          variant="destructive"
          className="ml-auto"
        >
          Limpiar todos
        </Button>
      )}
    </div>
  );
};
