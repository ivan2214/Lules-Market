import { Star, Store } from "lucide-react";
import Link from "next/link";
import type { ProductDTO } from "@/app/data/product/product.dto";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { ImageWithSkeleton } from "../image-with-skeleton";

interface ProductPublicCardProps {
  product: ProductDTO;
}

export function ProductPublicCard({ product }: ProductPublicCardProps) {
  return (
    <Card className="h-96 w-64 overflow-hidden p-0 transition-shadow hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.images?.[0] ? (
          <ImageWithSkeleton
            src={product.images[0].url || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
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
            {product.price
              ? `ARS ${formatCurrency(product.price, "ARS")}`
              : "Consultar"}
          </p>
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/comercios/${product.business?.id}`} className="w-full">
          <div className="flex items-center justify-start gap-2 text-muted-foreground text-sm hover:text-foreground">
            <figure>
              {product.business?.logo ? (
                <ImageWithSkeleton
                  src={product.business?.logo?.url || "/placeholder.svg"}
                  alt={product.business?.name || "Logo"}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <Store className="h-4 w-4" />
              )}
            </figure>
            <span className="line-clamp-6 hover:underline">
              {product.business?.name}
            </span>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
}
