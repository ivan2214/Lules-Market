import Link from "next/link";
import { ImageWithSkeleton } from "@/app/shared/components/image-with-skeleton";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/app/shared/components/ui/card";
import type { ProductWithRelations } from "@/db/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { mainImage } from "@/utils/main-image";

interface ProductCardProps {
  product: ProductWithRelations;
}

export function ProductCard({ product }: ProductCardProps) {
  // Safe access to nested plan data
  const planType = product.business?.currentPlan?.plan?.type || "FREE";
  const isPremium = planType === "PREMIUM";
  const isBasic = planType === "BASIC";

  return (
    <Card
      key={product.id}
      className={cn(
        "h-full overflow-hidden border p-0 transition-all duration-300 hover:shadow-xl",
        isPremium &&
          "border-yellow-500/20 bg-linear-to-b from-yellow-500/5 to-background hover:border-yellow-500/40 hover:shadow-yellow-500/10",
        isBasic &&
          "border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10",
        !isPremium && !isBasic && "hover:border-primary/50",
      )}
    >
      {/* Image Container */}
      <Link href={`/producto/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ImageWithSkeleton
            src={mainImage(product.images)}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {isPremium && (
            <div className="absolute top-2 right-2">
              <Badge className="border-none bg-yellow-500 text-white shadow-sm hover:bg-yellow-600">
                Destacado
              </Badge>
            </div>
          )}
          {product.category && (
            <div className="absolute bottom-2 left-2">
              <Badge
                variant="secondary"
                className="bg-background/80 font-medium text-[10px] backdrop-blur-sm"
              >
                {product.category.label}
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4 pt-3">
        <CardTitle className="5rem] line-clamp-2 min-h-10 font-semibold text-base leading-tight tracking-tight transition-colors group-hover:text-primary">
          {product.name}
        </CardTitle>

        <div className="mt-3 flex items-baseline gap-1">
          <span className="font-bold text-primary text-xl">
            {formatCurrency(product.price || 0, "ARS")}
          </span>
          {isPremium && (
            <span className="font-medium text-[10px] text-muted-foreground uppercase tracking-wider">
              Oferta
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted",
                isPremium &&
                  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                isBasic &&
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              )}
            >
              <ImageWithSkeleton
                src={product.business?.logo?.url || ""}
                alt={product.business?.name || "Comercio Local"}
                className="aspect-square h-full w-full rounded-full object-cover object-center"
              />
            </div>
            <span
              className={cn(
                "truncate font-medium",
                isPremium && "text-yellow-700 dark:text-yellow-400",
                isBasic && "text-blue-700 dark:text-blue-400",
              )}
            >
              {product.business?.name || "Comercio Local"}
            </span>
          </div>
          {(product.business?.verified || isPremium) && (
            <div title="Verificado" className="text-primary">
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                Verificado
              </Badge>
            </div>
          )}
        </div>
        <Button
          className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
          variant="outline"
          size="sm"
        >
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
}
