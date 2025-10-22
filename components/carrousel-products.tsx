"use client";
import Autoplay from "embla-carousel-autoplay";
import { ProductPublicCard } from "@/components/public/product-public-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/types";

type CarrouselProductsProps = { products: Product[] };

export const CarrouselProducts: React.FC<CarrouselProductsProps> = ({
  products,
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full max-w-6xl"
    >
      <CarouselContent className="-ml-40 lg:-ml-48">
        {products.map((product) => (
          <CarouselItem className="basis-1/5 pl-40 lg:pl-48" key={product.id}>
            <ProductPublicCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
