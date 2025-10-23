import {
  ArrowLeft,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trackBusinessView } from "@/app/actions/analytics-actions";
import {
  getPublicBusiness,
  getPublicBusinesses,
} from "@/app/actions/public-actions";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { ProductGrid } from "@/components/public/product-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id } = await params;

  // fetch data
  const business = await getPublicBusiness(id);

  if (!business) {
    notFound();
  }

  // Preparar imágenes para OpenGraph
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

  // Crear una descripción optimizada para SEO
  const seoDescription = business.description
    ? `${business.description.substring(0, 155)}${business.description.length > 155 ? "..." : ""}`
    : `Descubre ${business.name} en Lules Market. Comercio local en Argentina con productos de calidad.`;

  // Crear keywords basadas en el comercio
  const keywords = [
    business.name,
    business.category || "",
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
      canonical: `https://lules-market.vercel.app/comercios/${id}`,
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
      url: `https://lules-market.vercel.app/comercios/${id}`,
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
        url: `https://lules-market.vercel.app/comercios/${id}`,
      },
    ],
    category: business.category,
    other: {
      "business:contact_data:street_address": business.address || "",
      "business:contact_data:email": business.email || "",
      "business:contact_data:phone_number": business.phone || "",
      "business:contact_data:website": business.website || "",
    },
  };
}

export async function generateStaticParams() {
  const { businesses } = await getPublicBusinesses();
  return businesses.map((business) => ({ id: business.id }));
}

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = await getPublicBusiness(id);

  if (!business) {
    notFound();
  }

  await trackBusinessView(id);

  return (
    <div className="container mx-auto py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/explorar">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <div className="space-y-8">
        {/* Business Header */}
        <div className="flex flex-col gap-6 md:flex-row">
          {business.logo && (
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
              <ImageWithSkeleton
                src={business.logo.url || "/placeholder.svg"}
                alt={business.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-bold text-3xl tracking-tight">
              {business.name}
            </h1>
            {business.description && (
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {business.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-4">
              {business.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{business.address}</span>
                </div>
              )}
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{business.phone}</span>
                </a>
              )}
              {business.email && (
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{business.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="mb-4 font-semibold">Contactar</h2>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {business.whatsapp && (
                <Button asChild variant="outline" className="bg-transparent">
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              )}
              {business.website && (
                <Button asChild variant="outline" className="bg-transparent">
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Sitio Web
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <div>
          <h2 className="mb-6 font-bold text-2xl">Productos</h2>
          {!business.products || !business.products.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Este negocio aún no tiene productos publicados
                </p>
              </CardContent>
            </Card>
          ) : (
            <ProductGrid products={business.products} />
          )}
        </div>
      </div>
    </div>
  );
}
