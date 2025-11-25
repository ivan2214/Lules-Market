"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createSearchUrl, type TypeExplorer } from "@/lib/utils";

type SearchAndFiltersProps = {
  params?: {
    search?: string;
    category?: string;
    page?: string;
    businessId?: string;
    limit?: string;
    sortBy?: string;
    minRating?: string;
  };
  typeExplorer: TypeExplorer;
};

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  params,
  typeExplorer,
}) => {
  const { minRating, search, sortBy } = params || {};
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [searchValue, setSearchValue] = useState(search || "");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit");

    e.preventDefault();
    const url = createSearchUrl({
      currentParams: params,
      updates: { search: searchValue },
      typeExplorer,
    });
    console.log("url", url);
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

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>Refina tu búsqueda de comercios</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="open"
                checked={showOpenOnly}
                onCheckedChange={(checked) =>
                  setShowOpenOnly(checked as boolean)
                }
              />
              <Label htmlFor="open">Solo comercios abiertos</Label>
            </div>
            <div>
              <Label>Calificación mínima</Label>
              <Select value={minRating?.toString()} onValueChange={() => {}}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todas</SelectItem>
                  <SelectItem value="3">3+ estrellas</SelectItem>
                  <SelectItem value="4">4+ estrellas</SelectItem>
                  <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                className="w-full"
                onClick={() => {
                  setShowOpenOnly(false);
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
