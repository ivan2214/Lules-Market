"use client";
import Autoplay from "embla-carousel-autoplay";
import type { ProductDTO } from "@/app/data/product/product.dto";
import { ProductPublicCard } from "@/components/public/product-public-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CarrouselProductsProps = { products: ProductDTO[]; autoplay?: boolean };

export const CarrouselProducts: React.FC<CarrouselProductsProps> = ({
  products,
  autoplay = false,
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={
        autoplay
          ? [
              Autoplay({
                delay: 2000,
              }),
            ]
          : []
      }
      className="w-full max-w-xs md:max-w-2xl lg:max-w-6xl"
    >
      <CarouselContent className="-ml-52 md:-ml-40 lg:-ml-48">
        {products.map((product) => (
          <CarouselItem
            className="basis-1/2 pl-52 md:basis-1/3 md:pl-40 lg:basis-1/5 lg:pl-48"
            key={product.id}
          >
            <ProductPublicCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
