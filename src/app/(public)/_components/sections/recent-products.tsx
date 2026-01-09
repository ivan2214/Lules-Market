"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductList } from "@/app/(public)/_components/product-list";
import { orpc } from "@/orpc";
import { Button } from "@/shared/components/ui/button";

export function RecentProducts() {
  const { data: products } = useSuspenseQuery(
    orpc.products.public.recentProducts.queryOptions(),
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
