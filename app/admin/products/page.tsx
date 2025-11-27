import { cacheLife, cacheTag } from "next/cache";
import prisma from "@/lib/prisma";
import { ProductsClient } from "./components/products-client";

export default async function ProductsPage() {
  "use cache";
  cacheLife("hours");
  cacheTag("products-page");
  const products = await prisma.product.findMany({
    include: {
      images: true,
      business: true,
    },
  });

  console.dir(products[0]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Gestión de Productos
        </h1>
        <p className="text-muted-foreground">
          Administra todos los productos de la plataforma
        </p>
      </div>
      <ProductsClient products={products} />
    </div>
  );
}
