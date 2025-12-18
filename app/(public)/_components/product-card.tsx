import Link from "next/link";
import { ImageWithSkeleton } from "@/app/shared/components/image-with-skeleton";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import type { ProductWithRelations } from "@/db/types";
import { formatCurrency } from "@/utils/format";
import { mainImage } from "@/utils/main-image";

interface ProductCardProps {
  product: ProductWithRelations;
  isCarrousel?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link key={product.id} href={`/producto/${product.id}`}>
      <Card className="overflow-hidden p-0 transition-all hover:shadow-lg">
        <div className="aspect-square overflow-hidden">
          <ImageWithSkeleton
            src={mainImage(product.images)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <Badge variant="outline" className="text-xs">
              {product.category?.label}
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 text-base">
            {product.name}
          </CardTitle>
          <CardDescription className="text-xs">
            {product.business?.name || "Anónimo"}
          </CardDescription>
        </CardHeader>
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full items-center justify-between">
            <p className="font-bold text-primary text-xl">
              {formatCurrency(product.price || 0, "ARS")}
            </p>
            <Button size="sm" variant="outline">
              Ver
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
