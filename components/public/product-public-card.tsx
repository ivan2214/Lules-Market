import { Star, Store } from "lucide-react";
import Link from "next/link";
import type { ProductDTO } from "@/app/data/product/product.dto";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { ImageWithSkeleton } from "../image-with-skeleton";
import { Button } from "../ui/button";

interface ProductPublicCardProps {
  product: ProductDTO;
  isCarrousel?: boolean;
}

export function ProductPublicCard({
  product,
  isCarrousel = true,
}: ProductPublicCardProps) {
  return (
    <Card
      className={cn(
        "z-20 h-96 w-full justify-between overflow-hidden p-0 transition-shadow hover:shadow-lg lg:w-56",
        isCarrousel && "w-64",
      )}
    >
      <CardHeader className="relative aspect-square h-2/3 overflow-hidden bg-muted p-0 lg:h-1/3">
        <Link href={`/producto/${product.id}`}>
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
        </Link>
      </CardHeader>

      <CardContent className="px-4 py-0">
        <Link href={`/producto/${product.id}`}>
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
          {product.categories?.length &&
            product.categories.map((category) => (
              <Badge variant="outline" className="text-xs" key={category.id}>
                {category.value}
              </Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 p-4 pt-0">
        <Link href={`/comercios/${product.business?.id}`} className="w-full">
          <div className="flex items-center justify-start gap-2 text-muted-foreground text-sm hover:text-foreground">
            {product.business?.logo ? (
              <div className="h-10 w-10 rounded-full">
                <ImageWithSkeleton
                  src={product.business?.logo?.url || "/placeholder.svg"}
                  alt={product.business?.name || "Logo"}
                  className="h-full w-full rounded-full object-cover object-center"
                />
              </div>
            ) : (
              <Store className="h-4 w-4" />
            )}
            <span className="line-clamp-6 hover:underline">
              {product.business?.name}
            </span>
          </div>
        </Link>
        <Button variant="outline" className="w-full md:hidden" asChild>
          <Link href={`/producto/${product.id}`}>Ver producto</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
