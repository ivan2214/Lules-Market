/**
 * Componente para añadir structured data (Schema.org JSON-LD) a las páginas
 * Mejora el SEO y la visibilidad en motores de búsqueda
 */

import { env } from "@/env/client";

interface OrganizationSchemaProps {
  name: string;
  description: string;
  url: string;
  logo?: string;
}

export function OrganizationSchema({
  name,
  description,
  url,
  logo,
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    description,
    url,
    logo: logo || `${env.NEXT_PUBLIC_APP_URL}/logo.webp`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Spanish"],
    },
    areaServed: {
      "@type": "Country",
      name: "Argentina",
    },
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires this
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description?: string | null;
  price?: number | null;
  currency?: string;
  image?: string;
  availability?: "InStock" | "OutOfStock";
  seller?: {
    name: string;
    url: string;
  };
  url: string;
}

export function ProductSchema({
  name,
  description,
  price,
  currency = "ARS",
  image,
  availability = "InStock",
  seller,
  url,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || name,
    image: image || `${env.NEXT_PUBLIC_APP_URL}/logo.webp`,
    offers: price
      ? {
          "@type": "Offer",
          price: price.toString(),
          priceCurrency: currency,
          availability: `https://schema.org/${availability}`,
          seller: seller
            ? {
                "@type": "Organization",
                name: seller.name,
                url: seller.url,
              }
            : undefined,
        }
      : undefined,
    url,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <JSON-LD>
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

interface LocalBusinessSchemaProps {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  image?: string;
  url: string;
}

export function LocalBusinessSchema({
  name,
  description,
  address,
  phone,
  email,
  image,
  url,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description: description || `${name} - Comercio local en Argentina`,
    image: image || `${env.NEXT_PUBLIC_APP_URL}/logo.webp`,
    url,
    address: address
      ? {
          "@type": "PostalAddress",
          addressCountry: "AR",
          streetAddress: address,
        }
      : undefined,
    telephone: phone,
    email,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires this
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data requires this
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
