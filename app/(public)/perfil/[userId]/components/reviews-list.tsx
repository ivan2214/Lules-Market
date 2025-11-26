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
      {reviews.map((review) => {
        const isProduct = !!review.product;
        const item = review.product || review.business;
        const image = isProduct
          ? review.product?.images?.[0]?.url
          : review.business?.logo?.url;
        const href = isProduct
          ? `/explorar/producto/${review.product?.id}`
          : `/negocio/${review.business?.id}`;

        if (!item) return null;

        return (
          <Card
            key={review.id}
            className={`overflow-hidden transition-all hover:shadow-md ${
              isProduct
                ? "border-l-4 border-l-blue-500"
                : "border-l-4 border-l-purple-500"
            }`}
          >
            <CardHeader className="bg-muted/20 p-4 pb-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Link
                    href={href}
                    className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-background shadow-sm"
                  >
                    {image ? (
                      <Image
                        src={image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        {isProduct ? (
                          <ShoppingBag className="h-6 w-6" />
                        ) : (
                          <Store className="h-6 w-6" />
                        )}
                      </div>
                    )}
                  </Link>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="line-clamp-1 font-semibold text-base">
                        <Link href={href} className="hover:underline">
                          {item.name}
                        </Link>
                      </h3>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={isProduct ? "default" : "secondary"}
                        className={`h-5 px-2 font-medium text-[10px] ${
                          isProduct
                            ? "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "border-purple-200 bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        {isProduct ? "Producto" : "Comercio"}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {format(new Date(review.createdAt), "d MMM yyyy", {
                          locale: es,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 rounded-full border border-yellow-100 bg-yellow-50 px-2 py-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-xs text-yellow-700">
                      {review.rating}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="relative">
                <span className="-top-1 -left-1 absolute font-serif text-2xl text-muted-foreground/20">
                  "
                </span>
                <p className="line-clamp-3 pl-3 text-foreground/80 text-sm italic">
                  {review.comment}
                </p>
                <span className="-bottom-3 -right-1 absolute font-serif text-2xl text-muted-foreground/20">
                  "
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
