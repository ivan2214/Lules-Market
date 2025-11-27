import type { Image } from "@/app/generated/prisma/client";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  images?: Image[] | null;
  name: string;
};

export function ProductImages({ images, name }: Props) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <Carousel className="w-full">
          <CarouselContent>
            {images?.map((image) => (
              <CarouselItem key={image.key}>
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <ImageWithSkeleton
                    src={image.url}
                    alt={`${name} - Imagen ${image.key}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        {/* Thumbnails */}
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {images?.map((image, index) => (
            <Button
              key={image.key}
              className="flex-shrink-0 overflow-hidden rounded-md border-2 border-transparent hover:border-primary"
            >
              <ImageWithSkeleton
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="h-20 w-20 object-cover"
              />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
