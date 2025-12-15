"use client";
import Autoplay from "embla-carousel-autoplay";
import type { ProductDTO } from "@/app/data/product/product.dto";
import { ProductPublicCard } from "@/components/public/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type CarrouselProductsProps = { products: ProductDTO[]; autoplay?: boolean };

export const CarrouselProducts: React.FC<CarrouselProductsProps> = ({
  products,
  autoplay = false,
}) => {
  return (
    <Carousel
      opts={{
        breakpoints: {
          "640": {
            align: "center",
          },
          "1024": {
            align: "start",
          },
        },
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
      className="mx-auto w-full max-w-xs md:max-w-2xl lg:max-w-6xl"
    >
      <CarouselContent className="-mr-52 md:-mr-24 lg:-mr-2">
        {products.map((product) => (
          <CarouselItem
            className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/5"
            key={product.id}
          >
            <ProductPublicCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
