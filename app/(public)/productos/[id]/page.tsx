import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trackProductView } from "@/app/actions/analytics-actions";
import {
  getPublicProduct,
  getPublicProducts,
} from "@/app/actions/public-actions";
import { Button } from "@/components/ui/button";
import type { IconComponentName } from "@/types";
import { BusinessCard } from "./components/business-card";
import { ProductImages } from "./components/product-images";
import { ProductInfo } from "./components/product-info";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id } = await params;

  // fetch data
  const product = await getPublicProduct(id);

  if (!product) {
    notFound();
  }

  const ogImages = product.images?.map((image) => ({
    url: image.url,
    width: 1200,
    height: 630,
    alt: product.name,
  }));

  // Crear una descripción optimizada para SEO
  const seoDescription = product.description
    ? `${product.description.substring(0, 155)}${product.description.length > 155 ? "..." : ""}`
    : `Compra ${product.name} en Lules Market. Productos de calidad en Argentina.`;

  // Crear keywords basadas en el producto
  const keywords = [
    product.name,
    product.category || "",
    product.business?.name,
    "comprar online",
    "Argentina",
    "Lules Market",
    "productos",
  ].filter(Boolean);

  return {
    title: `${product.name} | ${product.business?.name} | Lules Market`,
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
      canonical: `https://lules-market.vercel.app/productos/${id}`,
    },
    openGraph: {
      type: "website",
      countryName: "Argentina",
      title: product.name,
      siteName: "Lules Market",
      description: seoDescription,
      images: ogImages?.length
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
      url: `https://lules-market.vercel.app/productos/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: seoDescription,
      images: ogImages?.length
        ? [ogImages[0].url]
        : ["https://lules-market.vercel.app/og-image.jpg"],
      creator: "@lulesmarket",
      site: "@lulesmarket",
    },
    authors: [
      {
        name: product.business?.name,
        url: `https://lules-market.vercel.app/comercios/${product.business?.id}`,
      },
    ],
    category: product.category,
    other: {
      "product:price:amount": product.price?.toString() || "",
      "product:price:currency": "ARS",
    },
  };
}

export async function generateStaticParams() {
  const { products } = await getPublicProducts();
  return products.map((product) => ({ id: product.id }));
}

interface ContactMethod {
  icon: IconComponentName;
  label: string;
  value?: string | null;
  href?: string | null;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getPublicProduct(id);
  if (!product) {
    notFound();
  }
  await trackProductView(id);

  const contactMethods: ContactMethod[] = [
    {
      label: "WhatsApp",
      value: product.business?.whatsapp,
      href: product.business?.whatsapp
        ? `https://wa.me/${product.business?.whatsapp.replace(/\D/g, "")}`
        : null,
      icon: "MessageCircle",
    },
    {
      label: "Teléfono",
      value: product.business?.phone,
      href: product.business?.phone
        ? `tel:${product.business?.phone}`
        : undefined,
      icon: "Phone",
    },
    {
      label: "Email",
      value: product.business?.email,
      href: product.business?.email
        ? `mailto:${product.business?.email}`
        : undefined,
      icon: "Mail",
    },
    {
      label: "Facebook",
      value: product.business?.facebook,
      href: product.business?.facebook,
      icon: "Facebook",
    },
    {
      label: "Instagram",
      value: product.business?.instagram,
      href: product.business?.instagram,
      icon: "Instagram",
    },
    {
      label: "Twitter",
      value: product.business?.twitter,
      href: product.business?.twitter,
      icon: "Twitter",
    },
  ];
  return (
    <div className="container space-y-8 p-8">
      <Button asChild variant="ghost">
        <Link href="/explorar" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductImages
          images={product.images}
          name={product.name}
          featured={product.featured}
        />
        <div className="space-y-6">
          <ProductInfo
            name={product.name}
            price={product.price}
            category={product.category}
            description={product.description}
          />
          <BusinessCard
            name={product.business?.name}
            id={product.business?.id}
            contactMethods={contactMethods.filter((method) => method.value)}
          />
        </div>
      </div>
    </div>
  );
}
