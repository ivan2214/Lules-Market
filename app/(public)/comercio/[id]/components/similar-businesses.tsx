import Link from "next/link";
import type { BusinessDTO } from "@/app/data/business/business.dto";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  businesses: BusinessDTO[];
};

export function SimilarBusinesses({ businesses }: Props) {
  if (!businesses.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comercios similares</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[300px] space-y-3 overflow-y-auto md:max-h-[400px] md:space-y-4">
        {businesses.map((business) => (
          <Link key={business.id} href={`/comercio/${business.id}`}>
            <div className="h-full overflow-hidden rounded-lg border border-transparent p-0 transition-all hover:border-border hover:shadow-lg">
              <div className="grid gap-3 md:grid-cols-[120px_1fr] md:gap-4">
                <div className="aspect-video overflow-hidden rounded-md md:aspect-square">
                  <ImageWithSkeleton
                    src={business.logo?.url || "/placeholder.svg"}
                    alt={business.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between px-2 pb-3 md:p-0">
                  <header>
                    <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                      <h2 className="line-clamp-1 font-semibold text-base md:text-lg">
                        {business.name}
                      </h2>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {business.category?.label}
                      </Badge>
                    </div>
                    <p className="mb-2 line-clamp-2 text-muted-foreground text-xs md:text-sm">
                      {business.description}
                    </p>
                  </header>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
