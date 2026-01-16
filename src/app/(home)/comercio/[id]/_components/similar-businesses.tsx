import Link from "next/link";
import { ImageWithSkeleton } from "@/shared/components/image-with-skeleton";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { BusinessDto } from "@/shared/utils/dto";

type Props = {
  businesses: BusinessDto[];
};

export function SimilarBusinesses({ businesses }: Props) {
  if (!businesses.length) return null;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">
          Comercios Similares
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {businesses.map((business) => (
          <Link
            key={business.id}
            href={`/comercio/${business.id}`}
            className="group"
          >
            <div className="h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg">
              <div className="flex gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg md:h-24 md:w-24">
                  <ImageWithSkeleton
                    src={
                      business.logoUrl ||
                      "/placeholder.svg?height=100&width=100&query=business+logo"
                    }
                    alt={business.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="line-clamp-1 font-semibold text-base leading-snug">
                      {business.name}
                    </h3>
                    {business.category && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {business.category}
                      </Badge>
                    )}
                  </div>
                  <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                    {business.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
