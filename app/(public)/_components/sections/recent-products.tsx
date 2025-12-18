"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/shared/components/ui/button";
import { Card, CardHeader } from "@/app/shared/components/ui/card";
import { orpcTanstack } from "@/lib/orpc";
import { ProductList } from "../product-list";

export function RecentProducts() {
  const { data: products } = useSuspenseQuery(
    orpcTanstack.products.recentProducts.queryOptions(),
  );

  return (
    <section className="mb-24 rounded-3xl bg-muted/30 px-6 py-16 md:px-12">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div>
          <h2 className="mb-2 font-bold text-3xl tracking-tight md:text-4xl">
            Novedades Recientes
          </h2>
          <p className="text-lg text-muted-foreground">
            Los últimos productos agregados por nuestros comercios.
          </p>
        </div>
        <Button
          variant="outline"
          className="group gap-2 border-primary/20 bg-background hover:border-primary/50"
          asChild
        >
          <Link href="/explorar/productos">
            Ver todo el catálogo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <ProductList products={products} />
    </section>
  );
}

export function RecentProductsSkeletons() {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square w-full animate-pulse bg-gray-200" />
            <CardHeader className="p-4">
              <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
