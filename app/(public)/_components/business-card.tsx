import Link from "next/link";
import type React from "react";
import { ImageWithSkeleton } from "@/app/shared/components/image-with-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import type { BusinessWithRelations } from "@/db/types";

interface BusinessCardProps {
  business: BusinessWithRelations;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Link key={business.id} href={`/comercio/${business.id}`}>
      <Card className="group hover:-translate-y-1 h-full overflow-hidden p-0 transition-all duration-300 hover:shadow-2xl">
        <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-muted to-muted/50">
          <ImageWithSkeleton
            src={business.logo?.url || "/placeholder.svg"}
            alt={business.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <CardHeader className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="line-clamp-1 text-xl transition-colors group-hover:text-primary">
                {business.name}
              </CardTitle>
              {business.category && (
                <CardDescription className="mt-1.5 font-medium">
                  {business.category.label}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-6">
          <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
            {business.description ||
              "Descubre este comercio local y sus productos."}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
