import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import {
  getBusinessById,
  getBusinessIds,
  getSimilarBusinesses,
} from "@/data/business/get";
import { env } from "@/env/server";
import { LocalBusinessSchema } from "@/shared/components/structured-data";
import { Button } from "@/shared/components/ui/button";
import { BusinessInfo } from "./_components/business-info";
import { BusinessViewTracker } from "./_components/business-view-tracker";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  const ogImages = [];

  if (business.coverImageUrl) {
    ogImages.push({
      url: business.coverImageUrl,
      width: 1200,
      height: 630,
      alt: business.name,
    });
  }

  if (business.logoUrl) {
    ogImages.push({
      url: business.logoUrl,
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
    business.category || "",
    "comercio local",
    "tienda online",
    "Argentina",
    "Lules Market",
    business.address ? "tienda física" : "",
  ];

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
      canonical: `${env.APP_URL}/comercio/${id}`,
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
              url: `${env.APP_URL}/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: "Lules Market",
            },
          ],
      locale: "es_AR",
      url: `${env.APP_URL}/comercio/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: business.name,
      description: seoDescription,
      images: ogImages.length
        ? [ogImages[0].url]
        : [`${env.APP_URL}/og-image.jpg`],
      creator: "@lulesmarket",
      site: "@lulesmarket",
    },
    authors: [
      {
        name: business.name,
        url: `${env.APP_URL}/comercio/${id}`,
      },
    ],
    category: business.categoryValue ?? undefined,
    other: {
      "business:contact_data:street_address": business.address || "",
      "business:contact_data:email": business.email || "",
      "business:contact_data:phone_number": business.phone || "",
      "business:contact_data:website": business.website || "",
    },
  };
}

export async function generateStaticParams() {
  return await getBusinessIds();
}

export default async function BusinessPage({ params }: Props) {
  const { id } = await params;
  const business = await getBusinessById(id);

  if (!business) {
    notFound();
  }

  const similarBusinesses = await getSimilarBusinesses({
    category: business.categoryValue || "",
    businessId: id,
    limit: 4,
  });

  return (
    <div className="container mx-auto space-y-8 py-8">
      <Suspense fallback={null}>
        <BusinessViewTracker businessId={id} />
      </Suspense>

      <LocalBusinessSchema
        name={business.name}
        description={business.description || ""}
        address={business.address || ""}
        phone={business.phone || ""}
        email={business.email || ""}
        image={business.logoUrl || ""}
        url={`${env.APP_URL}/comercio/${id}`}
      />
      <Button asChild variant="ghost">
        <Link href="/explorar/comercios" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Link>
      </Button>

      <BusinessInfo business={business} similarBusinesses={similarBusinesses} />
    </div>
  );
}
