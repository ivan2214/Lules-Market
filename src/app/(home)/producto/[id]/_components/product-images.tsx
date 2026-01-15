import type { Image } from "@/db/types";
import { ImageWithSkeleton } from "@/shared/components/image-with-skeleton";
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
    <>
      <Carousel className="w-full space-y-4">
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

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto px-4 lg:px-0">
        {images?.map((image, index) => (
          <div
            key={image.key}
            className="h-16 w-16 overflow-hidden rounded-md p-0"
          >
            <ImageWithSkeleton
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full rounded-md object-cover transition-all hover:scale-110"
            />
          </div>
        ))}
      </div>
    </>
  );
}
