"use client";

import {
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { ImageWithSkeleton } from "@/app/shared/components/image-with-skeleton";
import { Badge } from "@/app/shared/components/ui/badge";
import { Button } from "@/app/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/shared/components/ui/card";
import type { BusinessWithRelations } from "@/db/types";
import { formatCurrency } from "@/utils/format";
import { mainImage } from "@/utils/main-image";
import { SimilarBusinesses } from "./similar-businesses";

type BusinessInfoProps = {
  business: BusinessWithRelations;
  similarBusinesses?: BusinessWithRelations[];
};

export const BusinessInfo: React.FC<BusinessInfoProps> = ({
  business,
  similarBusinesses,
}) => {
  const products: BusinessWithRelations["products"] = business?.products;

  return (
    <main className="container px-4 py-4 md:py-8">
      {/* Hero Section with Image Carousel */}
      <div className="mb-6 md:mb-8">
        <div className="mx-auto max-w-5xl">
          <div className="w-full">
            <div className="aspect-4/3 overflow-hidden rounded-xl md:aspect-video md:rounded-2xl">
              <ImageWithSkeleton
                src={business?.coverImage?.url || "/placeholder.svg"}
                alt={`${business?.name} - Imagen principal`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Header */}
      <div className="mb-6 grid gap-4 md:mb-8 md:gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg md:text-xl">
                {business?.name}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{business?.description}</CardDescription>
            </CardContent>
            {business.tags && business.tags.length > 0 && (
              <CardFooter className="flex flex-col items-start gap-4">
                <CardTitle>Características destacadas:</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {business.tags.map((feature: string) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
          {/* Productos destacados */}
          {products?.length && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Productos Destacados
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Algunos de nuestros productos más populares
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="w-full overflow-hidden rounded-md border"
                  >
                    <header>
                      <ImageWithSkeleton
                        src={mainImage(product.images) || "/placeholder.svg"}
                        alt={product.name}
                        className="h-48 w-full object-cover"
                      />
                    </header>
                    <article className="items-start1 flex flex-col justify-between gap-5 p-4">
                      <h2 className="font-semibold text-base md:text-lg">
                        {product.name}
                      </h2>
                      <p className="line-clamp-5 overflow-hidden font-extralight text-muted-foreground text-sm md:text-base">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-muted-foreground text-sm md:text-base">
                          {formatCurrency(product.price || 0, "ARS")}
                        </span>
                        <Button
                          size="sm"
                          className="text-xs md:text-sm"
                          asChild
                        >
                          <Link href={`/producto/${product.id}`}>
                            Ver producto
                          </Link>
                        </Button>
                      </div>
                    </article>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {/* similar business */}
          {similarBusinesses && similarBusinesses.length > 0 && (
            <SimilarBusinesses businesses={similarBusinesses} />
          )}
        </div>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          {/* Contact Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground md:mt-1 md:h-5 md:w-5" />
                <div>
                  <p className="font-medium text-sm md:text-base">Dirección</p>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {business?.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground md:mt-1 md:h-5 md:w-5" />
                <div>
                  <p className="font-medium text-sm md:text-base">Teléfono</p>
                  <a
                    href={`tel:${business?.phone}`}
                    className="text-primary text-xs hover:underline md:text-sm"
                  >
                    {business?.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground md:mt-1 md:h-5 md:w-5" />
                <div>
                  <p className="font-medium text-sm md:text-base">Email</p>
                  <a
                    href={`mailto:${business?.email}`}
                    className="break-all text-primary text-xs hover:underline md:text-sm"
                  >
                    {business?.email}
                  </a>
                </div>
              </div>
              {business?.website && (
                <div className="flex items-start gap-2 md:gap-3">
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground md:mt-1 md:h-5 md:w-5" />
                  <div>
                    <p className="font-medium text-sm md:text-base">
                      Sitio web
                    </p>
                    <a
                      href={`https://${business?.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary text-xs hover:underline md:text-sm"
                    >
                      {business?.website}
                    </a>
                  </div>
                </div>
              )}
              {business?.whatsapp && (
                <div className="flex items-start gap-2 md:gap-3">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground md:mt-1 md:h-5 md:w-5" />
                  <div>
                    <p className="font-medium text-sm md:text-base">WhatsApp</p>
                    <a
                      href={`https://wa.me/${business?.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs hover:underline md:text-sm"
                    >
                      {business?.whatsapp}
                    </a>
                  </div>
                </div>
              )}
              {business?.facebook && (
                <div className="flex items-start gap-2 md:gap-3">
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground md:mt-1 md:h-5 md:w-5" />
                  <div>
                    <p className="font-medium text-sm md:text-base">Facebook</p>
                    <a
                      href={`https://www.facebook.com/${business?.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary text-xs hover:underline md:text-sm"
                    >
                      {business?.facebook}
                    </a>
                  </div>
                </div>
              )}

              {business?.instagram && (
                <div className="flex items-start gap-2 md:gap-3">
                  <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground md:mt-1 md:h-5 md:w-5" />
                  <div>
                    <p className="font-medium text-sm md:text-base">
                      Instagram
                    </p>
                    <a
                      href={`https://www.instagram.com/${business?.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary text-xs hover:underline md:text-sm"
                    >
                      {business?.instagram}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full text-sm md:text-base">
                <Phone className="mr-2 h-4 w-4" />
                Llamar ahora
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent text-sm md:text-base"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar mensaje
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
};
