import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublicBusiness,
  getPublicBusinesses,
} from "@/app/actions/public-actions";
import { Button } from "@/components/ui/button";
import { BusinessHeader } from "./components/business-header";
import { BusinessProducts } from "./components/business-products";
import { ContactCard } from "./components/contact-card";
import { SimilarBusinesses } from "./components/similar-businesses";

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

  // Comercios de la misma categoría
  const allBusinesses = await getPublicBusinesses();
  const similarBusinesses = allBusinesses.businesses.filter(
    (b) => b.id !== id && b.category === business.category,
  );

  return (
    <div className="container mx-auto space-y-8 py-8">
      <Button asChild variant="ghost">
        <Link href="/explorar" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Link>
      </Button>

      <BusinessHeader
        businessId={id}
        name={business.name}
        description={business.description}
        logo={business.logo}
        address={business.address}
        phone={business.phone}
        email={business.email}
      />

      <ContactCard whatsapp={business.whatsapp} website={business.website} />

      <BusinessProducts products={business.products} />

      <SimilarBusinesses businesses={similarBusinesses} />
    </div>
  );
}
