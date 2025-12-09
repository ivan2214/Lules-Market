"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Business, Category } from "@/db";
import { createSearchUrl, type TypeExplorer } from "@/lib/utils";
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
  categories: Category[];
  businesses: Business[];
};

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  params,
  typeExplorer,
  categories,
  businesses,
}) => {
  const { search, sortBy, businessId } = params || {};

  const [searchValue, setSearchValue] = useState(search || "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = createSearchUrl({
      currentParams: params,
      updates: { search: searchValue },
      typeExplorer,
    });

    router.push(url);
  };

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
      <form onSubmit={handleSubmit} className="relative flex-1">
        <Link
          href={createSearchUrl({
            currentParams: params,
            updates: { search: searchValue },
            typeExplorer,
          })}
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

      {typeExplorer === "productos" ? (
        <Select
          value={sortBy}
          onValueChange={(value) => {
            createSearchUrl({
              currentParams: params,
              updates: { sortBy: value },
              typeExplorer,
            });
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Precio ascendente</SelectItem>
            <SelectItem value="price_desc">Precio descendente</SelectItem>
            <SelectItem value="name_asc">Nombre ascendente</SelectItem>
            <SelectItem value="name_desc">Nombre descendente</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Select
          value={sortBy}
          onValueChange={(value) => {
            createSearchUrl({
              currentParams: params,
              updates: { sortBy: value },
              typeExplorer,
            });
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mas recientes</SelectItem>
            <SelectItem value="oldest">Mas antiguos</SelectItem>
          </SelectContent>
        </Select>
      )}

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
            <h2 className="font-bold text-2xl">Categorias</h2>
            <CategoryPills
              typeExplorer={typeExplorer}
              categories={categories}
            />
          </section>

          {/* Business Pills */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl">Comercios</h2>
            <BusinessesPills
              businessId={businessId}
              typeExplorer={typeExplorer}
              businesses={businesses}
            />
          </section>
        </SheetContent>
      </Sheet>
    </div>
  );
};
