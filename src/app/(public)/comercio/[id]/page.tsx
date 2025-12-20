import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { orpc } from "@/lib/orpc";
import { ImageWithSkeleton } from "@/shared/components/image-with-skeleton";
import { LocalBusinessSchema } from "@/shared/components/structured-data";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/utils/format";
import { mainImage } from "@/shared/utils/main-image";
import { BusinessViewTracker } from "./_components/business-view-tracker";
import { SimilarBusinesses } from "./_components/similar-businesses";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { business } = await orpc.business.getBusinessById({ id });

  if (!business) {
    notFound();
  }

  const ogImages = [];

  if (business.coverImage) {
    ogImages.push({
      url: business.coverImage.url,
      width: 1200,
      height: 630,
      alt: business.name,
    });
  }

  if (business.logo) {
    ogImages.push({
      url: business.logo.url,
      width: 800,
      height: 800,
      alt: `Logo de ${business.name}`,
    });
  }

  const seoDescription = business.description
    ? `${business.description.substring(0, 155)}${business.description.length > 155 ? "..." : ""}`
    : `Descubre ${business.name} en Lules Market. Comercio local en Argentina con productos de calidad.`;

  const keywords = [
    business.name,
    business.category,
    "comercio local",
    "tienda online",
    "Argentina",
    "Lules Market",
    business.address ? "tienda física" : "",
  ].filter(Boolean);

  return {
    title: `${business.name} | Comercio en Lules Market`,
    description: seoDescription,
    keywords: keywords.join(", "),
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `https://lules-market.vercel.app/comercio/${id}`,
    },
    openGraph: {
      type: "website",
      countryName: "Argentina",
      title: business.name,
      siteName: "Lules Market",
      description: seoDescription,
      images: ogImages.length
        ? ogImages
        : [
            {
              url: "https://lules-market.vercel.app/og-image.jpg",
              width: 1200,
              height: 630,
              alt: "Lules Market",
            },
          ],
      locale: "es_AR",
      url: `https://lules-market.vercel.app/comercio/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: business.name,
      description: seoDescription,
      images: ogImages.length
        ? [ogImages[0].url]
        : ["https://lules-market.vercel.app/og-image.jpg"],
      creator: "@lulesmarket",
      site: "@lulesmarket",
    },
    authors: [
      {
        name: business.name,
        url: `https://lules-market.vercel.app/comercio/${id}`,
      },
    ],
    category: business.category?.value,
    other: {
      "business:contact_data:street_address": business.address || "",
      "business:contact_data:email": business.email || "",
      "business:contact_data:phone_number": business.phone || "",
      "business:contact_data:website": business.website || "",
    },
  };
}

export async function generateStaticParams() {
  const { businesses } = await orpc.business.listAllBusinesses();

  // fallback si no hay negocios
  if (!businesses.length) {
    return [{ id: "static-fallback" }];
  }

  return businesses.map((business) => ({ id: business.id }));
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { business } = await orpc.business.getBusinessById({ id });

  if (!business) {
    notFound();
  }

  // Comercios de la misma categoría
  const { businesses: similarBusinesses } =
    await orpc.business.listAllBusinessesByCategories({
      category: business.category?.value,
    });

  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* ✅ Tracking envuelto en Suspense */}
      <Suspense fallback={null}>
        <BusinessViewTracker businessId={id} />
      </Suspense>

      <LocalBusinessSchema
        name={business.name}
        description={business.description || ""}
        address={business.address || ""}
        phone={business.phone || ""}
        email={business.email || ""}
        image={business.logo?.url || ""}
        url={`https://lules-market.vercel.app/comercio/${id}`}
      />
      <Button asChild variant="ghost">
        <Link href="/explorar/comercios" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Link>
      </Button>

      <section className="container px-4 py-4 md:py-8">
        <div className="mb-8 md:mb-12">
          <div className="mx-auto max-w-6xl">
            <div className="relative w-full">
              <div className="aspect-video overflow-hidden rounded-2xl shadow-xl md:aspect-21/9">
                <ImageWithSkeleton
                  src={
                    business?.coverImage?.url ||
                    "/placeholder.svg?height=600&width=1400&query=business+cover"
                  }
                  alt={`${business?.name} - Imagen de portada`}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Logo overlay */}
              {business?.logo?.url && (
                <div className="absolute bottom-0 left-6 translate-y-1/2 md:left-8">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-background bg-background shadow-xl md:h-32 md:w-32">
                    <ImageWithSkeleton
                      src={business.logo.url || "/placeholder.svg"}
                      alt={`${business.name} - Logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 md:gap-8 lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-2xl md:text-3xl">
                        {business?.name}
                      </CardTitle>
                      {business?.category?.label && (
                        <Badge variant="secondary" className="text-sm">
                          {business.category.label}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {business?.description}
                    </CardDescription>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 bg-transparent"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 bg-transparent"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {business.tags && business.tags.length > 0 && (
                <CardFooter className="flex flex-col items-start gap-3 border-t pt-6">
                  <p className="font-semibold text-sm">
                    Características destacadas
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map((feature: string) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="text-sm"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>

            {business.products && business.products.length > 0 && (
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">
                    Productos Destacados
                  </CardTitle>
                  <CardDescription>
                    Explora nuestra selección de productos
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {business.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/producto/${product.id}`}
                      className="group"
                    >
                      <div className="h-full overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg">
                        <div className="aspect-square overflow-hidden">
                          <ImageWithSkeleton
                            src={
                              mainImage({ images: product.images }) ||
                              "/placeholder.svg?height=400&width=400&query=product"
                            }
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-col gap-3 p-4">
                          <h3 className="line-clamp-2 font-semibold text-base leading-snug">
                            {product.name}
                          </h3>
                          <p className="line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                            {product.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="font-bold text-lg text-primary">
                              {formatCurrency(product.price || 0, "ARS")}
                            </span>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-xs"
                            >
                              Ver más
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Similar businesses */}
            {similarBusinesses && similarBusinesses.length > 0 && (
              <SimilarBusinesses businesses={similarBusinesses} />
            )}
          </div>

          <div className="space-y-6 lg:sticky lg:top-4 lg:self-start">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Dirección</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {business?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Teléfono</p>
                    <a
                      href={`tel:${business?.phone}`}
                      className="text-primary text-sm hover:underline"
                    >
                      {business?.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Email</p>
                    <a
                      href={`mailto:${business?.email}`}
                      className="break-all text-primary text-sm hover:underline"
                    >
                      {business?.email}
                    </a>
                  </div>
                </div>

                {business?.website && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Sitio web</p>
                      <a
                        href={`https://${business?.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-primary text-sm hover:underline"
                      >
                        {business?.website}
                      </a>
                    </div>
                  </div>
                )}

                {business?.whatsapp && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">WhatsApp</p>
                      <a
                        href={`https://wa.me/${business?.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm hover:underline"
                      >
                        {business?.whatsapp}
                      </a>
                    </div>
                  </div>
                )}

                {business?.facebook && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Facebook</p>
                      <a
                        href={`https://www.facebook.com/${business?.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-primary text-sm hover:underline"
                      >
                        {business?.facebook}
                      </a>
                    </div>
                  </div>
                )}

                {business?.instagram && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Instagram</p>
                      <a
                        href={`https://www.instagram.com/${business?.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-primary text-sm hover:underline"
                      >
                        {business?.instagram}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-3 border-t pt-6">
                <Button className="w-full shadow-sm" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar ahora
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar mensaje
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
