"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, startTransition, useEffect, useRef, useState } from "react";
import type { ProductWithRelations } from "@/db/types";
import { api } from "@/lib/eden";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { mainImage } from "@/shared/utils/main-image";
import { ImageWithSkeleton } from "./image-with-skeleton";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

export const SearchForm = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [results, setResults] = useState<{
    products: ProductWithRelations[];
    total: number;
  }>({ products: [], total: 0 });

  // ref para el debounce timer (usamos window.setTimeout que devuelve number en el navegador)
  const debounceRef = useRef<number | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/explorar/productos?search=${search}`);
    }
  }
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.trim() || value === "") {
      setResults({ products: [], total: 0 });
      setSearch("");
      return;
    }
    setSearch(value);

    // Debounce: espera 300ms antes de hacer la llamada, cancela la anterior si existe
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      startTransition(async () => {
        const { data } = await api.products.public.list.get({
          query: {
            search: value,
          },
        });
        setResults({ products: data?.products || [], total: data?.total || 0 });
      });
    }, 300);
  };

  // limpiar el timer al desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <section className="relative mx-auto w-full max-w-lg">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search
            onClick={handleSearch}
            className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-10"
            value={search}
            onChange={(e) => handleChange(e)}
          />
        </div>
      </form>
      {/* preview de los resultados que habira */}
      <Activity
        mode={results.products.length && search !== "" ? "visible" : "hidden"}
      >
        <section
          className={cn(
            "absolute z-50 mt-2 flex h-auto max-h-60 w-full max-w-md flex-1 flex-col items-center gap-4 overflow-y-scroll rounded-md bg-white p-5 opacity-0 shadow-lg transition-opacity duration-200 ease-in lg:max-w-lg",
            search && "opacity-100",
          )}
        >
          {results.products.length ? (
            results.products.map((product) => (
              <div
                key={product.id}
                className="flex w-full items-center justify-start gap-2 border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="h-12 w-12">
                  <ImageWithSkeleton
                    src={
                      mainImage({ images: product.images }) ||
                      product.images?.[0].url ||
                      ""
                    }
                    alt={product.name}
                    className="rounded object-cover"
                  />
                </div>
                <div>
                  <Link
                    href={`/producto/${product.id}`}
                    className="font-semibold text-sm hover:underline"
                    title={product.name}
                    aria-label={product.name}
                    onClick={() => {
                      setSearch("");
                      setResults({
                        products: [],
                        total: 0,
                      });
                    }}
                  >
                    {product.name}
                  </Link>
                  <span className="font-extralight text-sm">
                    ARS {formatCurrency(product.price || 0, "ARS")}
                  </span>
                </div>
                {product.category && (
                  <div className="ml-auto">
                    <Badge variant="outline" className="text-xs">
                      {product.category.value}
                    </Badge>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="mx-auto flex w-full flex-1 items-center justify-center py-10">
              <p className="mx-auto text-muted-foreground text-sm">
                No se encontraron resultados
              </p>
            </div>
          )}
        </section>
      </Activity>
    </section>
  );
};
