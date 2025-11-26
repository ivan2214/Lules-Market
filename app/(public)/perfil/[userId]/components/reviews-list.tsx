import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ShoppingBag, Star, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReviewDTO } from "@/app/data/review/review.dto";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ReviewsListProps {
  reviews: ReviewDTO[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {reviews.map((review) => (
        <Card key={review.id} className="overflow-hidden">
          <CardHeader className="bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-background">
                  {review.product?.images?.[0]?.url ? (
                    <Image
                      src={review.product.images[0].url}
                      alt={review.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : review.business?.logo?.url ? (
                    <Image
                      src={review.business.logo.url}
                      alt={review.business.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      {review.product ? (
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <Store className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="line-clamp-1 font-medium text-sm">
                    {review.product?.name || review.business?.name}
                  </h3>
                  <Link
                    href={
                      review.product
                        ? `/explorar/producto/${review.product.id}`
                        : `/negocio/${review.business?.id}`
                    }
                    className="text-muted-foreground text-xs hover:underline"
                  >
                    Ver {review.product ? "producto" : "comercio"}
                  </Link>
                </div>
              </div>
              <Badge variant="outline" className="shrink-0">
                <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                {review.rating}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="line-clamp-3 text-muted-foreground text-sm">
              "{review.comment}"
            </p>
            <p className="mt-2 text-muted-foreground/60 text-xs">
              {format(new Date(review.createdAt), "d 'de' MMMM, yyyy", {
                locale: es,
              })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
