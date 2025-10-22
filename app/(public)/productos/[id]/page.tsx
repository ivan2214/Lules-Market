import { ArrowLeft, Star, Store } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trackProductView } from "@/app/actions/analytics-actions";
import {
  getPublicProduct,
  getPublicProducts,
} from "@/app/actions/public-actions";
import { DynamicIcon } from "@/components/dynamic-icon";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { PublicFooter } from "@/components/public/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { IconComponentName } from "@/types";

type ContactMethod = {
  icon: IconComponentName;
  label: string;
  value: string | null;
  href?: string | null;
};

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

  const ogImages = product.images.map((image) => ({
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
    product.business.name,
    "comprar online",
    "Argentina",
    "Lules Market",
    "productos",
  ].filter(Boolean);

  return {
    title: `${product.name} | ${product.business.name} | Lules Market`,
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
      url: `https://lules-market.vercel.app/productos/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: seoDescription,
      images: ogImages.length
        ? [ogImages[0].url]
        : ["https://lules-market.vercel.app/og-image.jpg"],
      creator: "@lulesmarket",
      site: "@lulesmarket",
    },
    authors: [
      {
        name: product.business.name,
        url: `https://lules-market.vercel.app/comercios/${product.business.id}`,
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

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getPublicProduct(id);

  if (!product) {
    notFound();
  }

  // Track view
  const headersList = await headers();
  const referrer = headersList.get("referer") || undefined;
  await trackProductView(id, referrer);

  const contactMethods: ContactMethod[] = [
    {
      icon: "MessageCircle" as IconComponentName,
      label: "WhatsApp",
      value: product.business.whatsapp,
      href: product.business.whatsapp
        ? `https://wa.me/${product.business.whatsapp.replace(/\D/g, "")}`
        : null,
    },
    {
      icon: "Phone" as IconComponentName,
      label: "Teléfono",
      value: product.business.phone,
      href: `tel:${product.business.phone}`,
    },
    {
      icon: "Mail" as IconComponentName,
      label: "Email",
      value: product.business.email,
      href: `mailto:${product.business.email}`,
    },
    {
      icon: "Facebook" as IconComponentName,
      label: "Facebook",
      value: product.business.facebook,
      href: product.business.facebook,
    },
    {
      icon: "Instagram" as IconComponentName,
      label: "Instagram",
      value: product.business.instagram,
      href: product.business.instagram,
    },
    {
      icon: "Twitter" as IconComponentName,
      label: "Twitter",
      value: product.business.twitter,
      href: product.business.twitter,
    },
  ].filter((method) => method.value);

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/explorar">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {product.images[0] ? (
              <ImageWithSkeleton
                src={product.images[0].url || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Sin imagen
              </div>
            )}
            {product.featured && (
              <Badge className="absolute top-4 right-4 bg-amber-500">
                <Star className="mr-1 h-3 w-3" />
                Destacado
              </Badge>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image, i) => (
                <div
                  key={image.key}
                  className="aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  <ImageWithSkeleton
                    src={image.url || "/placeholder.svg"}
                    alt={`${product.name} ${i + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge className="mb-2">{product.category}</Badge>
            )}
            <h1 className="font-bold text-3xl tracking-tight">
              {product.name}
            </h1>
            <p className="mt-4 font-bold text-3xl">
              {product.price
                ? `$${product.price.toLocaleString()}`
                : "Consultar precio"}
            </p>
          </div>

          {product.description && (
            <div>
              <h2 className="mb-2 font-semibold">Descripción</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Business Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center gap-3">
                <Store className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{product.business.name}</p>
                  <Link
                    href={`/comercios/${product.business.id}`}
                    className="text-muted-foreground text-sm hover:underline"
                  >
                    Ver más productos
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">
                  Contactar al vendedor:
                </h3>
                <div className="grid gap-2">
                  {contactMethods.map((method) => (
                    <Button
                      key={method.label}
                      asChild
                      variant="outline"
                      className="justify-start bg-transparent"
                    >
                      <a
                        href={method.href || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <DynamicIcon
                          name={method.icon}
                          className="mr-2 h-4 w-4"
                        />
                        {method.label}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
