import Link from "next/link";
import type { BusinessWithRelations } from "@/db";
import { ImageWithSkeleton } from "../image-with-skeleton";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface BusinessCardProps {
  business: BusinessWithRelations;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  return (
    <Link key={business.id} href={`/comercio/${business.id}`}>
      <Card className="h-full overflow-hidden p-0 transition-all hover:shadow-lg">
        <div className="aspect-video overflow-hidden">
          <ImageWithSkeleton
            src={business.logo?.url || "/placeholder.svg"}
            alt={business.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="line-clamp-1">{business.name}</CardTitle>
              <CardDescription>{business.category?.label}</CardDescription>
            </div>
            <Badge variant="secondary">{business.category?.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
            {business.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};
