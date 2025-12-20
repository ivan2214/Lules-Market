import { Suspense } from "react";
import { ProductsContent } from "./_components/products-content";
import { ProductsSkeleton } from "./_components/products-skeleton";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
