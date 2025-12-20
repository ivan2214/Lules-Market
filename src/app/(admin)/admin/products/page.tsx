import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { CACHE_TAGS } from "@/shared/constants/cache-tags";
import { ProductsClient } from "./_components/products-client";

export default async function ProductsPage() {
  /* TODO: MOVER A CACHE-FUNCTIONS Y A ORPC */
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.ADMIN.PRODUCTS.GET_ALL);
  const products = await db.query.product.findMany({
    with: {
      images: true,
      business: true,
    },
  });

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
