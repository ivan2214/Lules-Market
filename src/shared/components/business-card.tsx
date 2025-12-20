import { MapPin } from "lucide-react";
import Link from "next/link";
import type { BusinessWithRelations } from "@/db/types";
import { ImageWithSkeleton } from "@/shared/components/image-with-skeleton";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type BusinessCardProps = { business: BusinessWithRelations };

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Card
      key={business.id}
      className="flex h-full w-full flex-col items-start justify-between gap-3 overflow-hidden p-0 transition-all hover:shadow-lg"
    >
      <CardHeader className="w-full p-0">
        <Link
          href={`/comercio/${business.id}`}
          className="relative aspect-video w-full overflow-hidden p-0"
        >
          <ImageWithSkeleton
            src={business.coverImage?.url || "/placeholder.svg"}
            alt={business.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          {/*   {business.open && (
            <Badge className="absolute top-2 right-2 bg-green-500">
              Abierto
            </Badge>
          )} */}
        </Link>
      </CardHeader>

      <CardContent className="flex h-full flex-col justify-between gap-y-3 p-3">
        <CardTitle className="line-clamp-1">{business.name}</CardTitle>
        <Badge variant="secondary">{business.category?.label}</Badge>
        <CardDescription className="line-clamp-5">
          {business.description}
        </CardDescription>
        <div className="flex items-center gap-2 text-secondary-foreground text-sm">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{business.address}</span>
        </div>
      </CardContent>
    </Card>
  );
};
