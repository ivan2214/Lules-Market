import Link from "next/link";
import type { ProductWithRelations } from "@/db/types";
import { ImageWithSkeleton } from "@/shared/components/image-with-skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/format";
import { mainImage } from "@/shared/utils/main-image";

interface ProductCardProps {
  product: ProductWithRelations;
}

export function ProductCard({ product }: ProductCardProps) {
  const planType = product.business?.currentPlan?.plan?.type || "FREE";
  const isPremium = planType === "PREMIUM";

  return (
    <Card
      key={product.id}
      className="group hover:-translate-y-1 h-full overflow-hidden border p-0 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl"
    >
      <Link href={`/producto/${product.id}`}>
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          <ImageWithSkeleton
            src={mainImage(product.images) || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {isPremium && (
            <div className="absolute top-3 right-3">
              <Badge className="border-none bg-linear-to-r from-yellow-500 to-yellow-600 text-white shadow-lg hover:from-yellow-600 hover:to-yellow-700">
                Destacado
              </Badge>
            </div>
          )}
          {product.category && (
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="secondary"
                className="bg-background/90 font-medium text-xs backdrop-blur-md"
              >
                {product.category.label}
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-5">
        <CardTitle className="line-clamp-2 min-h-12 font-semibold text-lg leading-snug tracking-tight transition-colors group-hover:text-primary">
          {product.name}
        </CardTitle>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-bold text-2xl text-primary">
            {formatCurrency(product.price || 0, "ARS")}
          </span>
          {isPremium && (
            <span className="font-semibold text-xs text-yellow-600 uppercase tracking-wide dark:text-yellow-400">
              Oferta
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-3 p-5 pt-0">
        <div className="flex w-full items-center justify-between">
          <Link
            href={`/comercio/${product.business?.id}`}
            className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden transition-transform hover:scale-105"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-muted">
              <ImageWithSkeleton
                src={product.business?.logo?.url || "/placeholder.svg"}
                alt={product.business?.name || "Comercio Local"}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="truncate font-semibold text-sm">
              {product.business?.name || "Comercio Local"}
            </span>
          </Link>
          {(product.business?.verified || isPremium) && (
            <Badge
              variant="secondary"
              className="h-5 shrink-0 px-2 text-[10px]"
            >
              Verificado
            </Badge>
          )}
        </div>
        <Button
          asChild
          className="h-10 w-full bg-transparent font-semibold transition-all group-hover:shadow-lg"
          variant="outline"
          size="sm"
        >
          <Link href={`/producto/${product.id}`}>Ver detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
