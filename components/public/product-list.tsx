"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpcTanstack } from "@/lib/orpc";
import { ProductCard } from "./product-card";

export function ProductList() {
  const { data: products } = useSuspenseQuery(
    orpcTanstack.products.recentProducts.queryOptions(),
  );
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard isCarrousel={false} key={product.id} product={product} />
      ))}
    </div>
  );
}
