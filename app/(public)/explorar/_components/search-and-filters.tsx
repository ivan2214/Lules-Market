"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/app/shared/components/ui/button";
import { Input } from "@/app/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/shared/components/ui/sheet";
import {
  type TypeExplorer,
  useSearchUrl,
} from "@/app/shared/hooks/use-search-url";
import { orpcTanstack } from "@/lib/orpc";
import { BusinessesPills } from "./businesses-pills";
import { CategoryPills } from "./category-pills";

type SearchAndFiltersProps = {
  params?: {
    search?: string;
    category?: string;
    page?: string;
    businessId?: string;
    limit?: string;
    sortBy?:
      | "price_asc"
      | "price_desc"
      | "name_asc"
      | "name_desc"
      | "newest"
      | "oldest";
  };
  typeExplorer: TypeExplorer;
};

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  params,
  typeExplorer,
}) => {
  const {
    data: { businesses },
  } = useSuspenseQuery(orpcTanstack.business.listAllBusinesses.queryOptions());

  const { data: categories } = useSuspenseQuery(
    orpcTanstack.category.listAllCategories.queryOptions(),
  );

  const { search, sortBy, businessId, category } = params || {};
  const [searchValue, setSearchValue] = useState(search || "");
  const router = useRouter();

  const { createUrl } = useSearchUrl({ currentParams: params, typeExplorer });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = createUrl({ search: searchValue });
    router.push(url);
  };

  const handleSortChange = (value: string) => {
    const url = createUrl({ sortBy: value });
    router.push(url);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
      <form onSubmit={handleSubmit} className="relative flex-1">
        <Link
          href={createUrl({ search: searchValue })}
          className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground"
        >
          <Search className="h-4 w-4" />
        </Link>

        <Input
          type="search"
          placeholder="Buscar comercios, ubicaciones..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </form>

      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {typeExplorer === "productos" ? (
            <>
              <SelectItem value="price_asc">Precio: Menor a mayor</SelectItem>
              <SelectItem value="price_desc">Precio: Mayor a menor</SelectItem>
              <SelectItem value="name_asc">Nombre: A-Z</SelectItem>
              <SelectItem value="name_desc">Nombre: Z-A</SelectItem>
            </>
          ) : (
            <>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguos</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </Button>
        </SheetTrigger>
        <SheetContent className="max-h-100vh overflow-y-auto px-4">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>Refina tu búsqueda de comercios</SheetDescription>
          </SheetHeader>

          {/* Category Pills */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">Categorías</h2>
            <CategoryPills
              typeExplorer={typeExplorer}
              categories={categories}
              category={category || ""}
            />
          </section>

          {/* Business Pills */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">Comercios</h2>
            <BusinessesPills
              typeExplorer={typeExplorer}
              businesses={businesses}
              businessId={businessId}
            />
          </section>
        </SheetContent>
      </Sheet>
    </div>
  );
};
