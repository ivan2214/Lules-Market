import type { Image } from "@/db/types";
import { ImageWithSkeleton } from "@/shared/components/image-with-skeleton";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";

type Props = {
  images?: Image[] | null;
  name: string;
};

export function ProductImages({ images, name }: Props) {
  return (
    <Card className="m-0 gap-0 p-0">
      <CardHeader className="overflow-hidden rounded-lg p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {images?.map((image) => (
              <CarouselItem key={image.key}>
                <div className="aspect-square bg-muted">
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
      </CardHeader>
      <CardContent className="m-0 px-2 py-3">
        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto">
          {images?.map((image, index) => (
            <Button
              variant="ghost"
              key={image.key}
              className="h-16 w-16 overflow-hidden rounded-md p-0"
            >
              <ImageWithSkeleton
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full rounded-md object-cover transition-all hover:scale-110"
              />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
