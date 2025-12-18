import Link from "next/link";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BusinessWithRelations } from "@/db/types";

type Props = {
  businesses: BusinessWithRelations[];
};

export function SimilarBusinesses({ businesses }: Props) {
  if (!businesses.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comercios similares</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10 md:gap-2">
        {businesses.map((business) => (
          <Link key={business.id} href={`/comercio/${business.id}`}>
            <div className="h-full overflow-hidden rounded-lg border transition-all hover:border-border hover:shadow-lg">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-2">
                <div className="aspect-video h-full md:col-span-1 md:aspect-square">
                  <ImageWithSkeleton
                    src={business.logo?.url || "/placeholder.svg"}
                    alt={business.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between px-2 py-3 md:col-span-2 md:p-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="line-clamp-1 font-semibold text-base md:text-lg">
                      {business.name}
                    </h2>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {business.category?.label}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-muted-foreground text-xs md:text-sm">
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
