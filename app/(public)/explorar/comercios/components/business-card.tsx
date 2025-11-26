import { MapPin, Star } from "lucide-react";
import Link from "next/link";
import type { BusinessDTO } from "@/app/data/business/business.dto";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BusinessCardProps = { business: BusinessDTO };

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Link key={business.id} href={`/comercio/${business.id}`}>
      <Card className="h-full overflow-hidden p-0 transition-all hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden">
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
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="line-clamp-1">{business.name}</CardTitle>
              <CardDescription>{business.category?.label}</CardDescription>
            </div>
            <Badge variant="secondary">{business.category?.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <p className="line-clamp-2 text-muted-foreground text-sm">
            {business.description}
          </p>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{business.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{business.rating}</span>
            </div>
            <span className="text-muted-foreground text-sm">
              ({business.reviews?.length} opiniones)
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
