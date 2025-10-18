import type { Image } from "@/app/generated/prisma";
import { ProductPublicCard } from "./product-public-card";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  images: Image[];
  category: string | null;
  featured: boolean;
  business: {
    id: string;
    name: string;
    plan: string;
    whatsapp: string | null;
    phone: string | null;
    email: string | null;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
  };
}

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductPublicCard key={product.id} product={product} />
      ))}
    </div>
  );
}
