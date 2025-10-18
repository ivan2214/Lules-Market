import { Star, Store } from "lucide-react";
import Link from "next/link";
import type { Image } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImageWithSkeleton } from "../image-with-skeleton";

interface ProductPublicCardProps {
  product: {
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
    };
  };
}

export function ProductPublicCard({ product }: ProductPublicCardProps) {
  return (
    <Card className="overflow-hidden p-0 transition-shadow hover:shadow-lg">
      <Link href={`/productos/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.images[0] ? (
            <ImageWithSkeleton
              src={product.images[0].url || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-amber-500">
              <Star className="mr-1 h-3 w-3" />
              Destacado
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="px-4 py-0">
        <Link href={`/productos/${product.id}`}>
          <h3 className="line-clamp-1 font-semibold hover:underline">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <p className="font-bold text-lg">
            {product.price ? `$${product.price.toLocaleString()}` : "Consultar"}
          </p>
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/comercios/${product.business.id}`}
          className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
        >
          <Store className="h-4 w-4" />
          <span className="line-clamp-1">{product.business.name}</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
