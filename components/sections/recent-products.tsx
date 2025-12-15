import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { orpc } from "@/lib/orpc";
import { ProductList } from "../public/product-list";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";

export async function RecentProducts() {
  const products = await orpc.products.recentProducts();
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl">Productos Recientes</h2>
          <p className="text-muted-foreground">Últimos productos publicados</p>
        </div>
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/explorar/productos">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <ProductList products={products} />
    </section>
  );
}

export function ProductsSkeletons() {
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
