import { Star } from "lucide-react";
import type { Image } from "@/app/generated/prisma";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Badge } from "@/components/ui/badge";

type Props = {
  images?: Image[] | null;
  name: string;
  featured?: boolean;
};

export function ProductImages({ images, name, featured }: Props) {
  const main = images?.[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {main ? (
          <ImageWithSkeleton
            src={main.url}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
        {featured && (
          <Badge className="absolute top-4 right-4 bg-amber-500">
            <Star className="mr-1 h-3 w-3" /> Destacado
          </Badge>
        )}
      </div>
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.slice(1, 5).map((img, i) => (
            <div
              key={img.key}
              className="aspect-square overflow-hidden rounded-lg bg-muted"
            >
              <ImageWithSkeleton
                src={img.url}
                alt={`${name} ${i + 2}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
