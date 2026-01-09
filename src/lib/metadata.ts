import type { Metadata } from "next";
import { env } from "@/env/server";

interface CreateMetadataOptions {
  title: string | { default: string; template: string };
  description: string;
  metadataBase?: URL;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
  keywords?: string[];
  authors?: { name: string; url?: string }[];
  category?: string;
  classification?: string;
  // Add other common metadata fields as needed
}

export function createMetadata(options: CreateMetadataOptions): Metadata {
  const {
    title,
    description,
    metadataBase,
    openGraph,
    twitter,
    keywords = [],
    authors = [{ name: "LulesMarket" }],
    category,
    classification,
  } = options;

  const baseUrl =
    metadataBase?.toString() || env.APP_URL || "http://localhost:3000";
  const titleString = typeof title === "string" ? title : title.default;

  // Keywords por defecto para LulesMarket
  const defaultKeywords = [
    "ofertas",
    "descuentos",
    "comercios locales",
    "promociones",
    "Argentina",
    "marketplace",
    "tiendas",
    "compras",
    "ahorro",
  ];

  const allKeywords = [...defaultKeywords, ...keywords];

  const defaultMetadata: Metadata = {
    title: title,
    description: description,
    keywords: allKeywords,
    authors: authors,
    category: category || "shopping",
    classification: classification || "business",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: titleString,
      description: description,
      url: baseUrl,
      siteName: "LulesMarket",
      images: [
        {
          url: "/static/lulesmarket-logo.webp",
          width: 1200,
          height: 630,
          alt: "LulesMarket - Ofertas de Comercios Locales",
        },
      ],
      type: "website",
      locale: "es_AR",
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: titleString,
      description: description,
      images: ["/static/lulesmarket-logo.webp"],
      creator: "@lulesmarket",
      site: "@lulesmarket",
      ...twitter,
    },
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/apple-touch-icon.png",
      },
      {
        rel: "android-chrome",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
    manifest: "/site.webmanifest",
    other: {
      "theme-color": "#3b82f6",
      "color-scheme": "light dark",
      "format-detection": "telephone=no",
    },
  };

  return defaultMetadata;
}
