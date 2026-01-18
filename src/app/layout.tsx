import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Toaster } from "@/shared/components/ui/sonner";
import { RootProviders } from "@/shared/providers/root-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type React from "react";
import { env } from "@/env/client";
import {
  OrganizationSchema,
  WebSiteSchema,
} from "@/shared/components/structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "Lules Market - Productos y Comercios Locales en Lules, Tucumán",
    template: "%s | Lules Market",
  },
  description:
    "Descubrí productos y comercios locales en Lules, Tucumán. Encontrá todo lo que necesitás: alimentos, ropa, servicios y más de negocios de tu zona.",
  keywords: [
    "Lules",
    "Lules Tucumán",
    "productos Lules",
    "comercios Lules",
    "comprar en Lules",
    "negocios Lules",
    "tiendas Lules",
    "emprendimientos Lules",
    "marketplace Lules",
    "comercios locales Tucumán",
    "productos locales Tucumán",
    "vitrina digital",
    "negocios locales",
    "compras locales",
  ],
  authors: [{ name: "Lules Market" }],
  creator: "Lules Market",
  publisher: "Lules Market",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "8NkhaNOxnwiM0xa44M867a1R-phEJqisP8XMcJYaQfE",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Lules Market",
    title: "Lules Market - Productos y Comercios Locales en Lules",
    description:
      "Descubrí productos y comercios locales en Lules, Tucumán. Tu vitrina digital para comprar y vender en tu comunidad.",
    images: [
      {
        url: "/logo.webp",
        width: 512,
        height: 512,
        alt: "Lules Market - Tu vitrina digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lules Market - Productos y Comercios en Lules",
    description: "Descubrí productos y comercios locales en Lules, Tucumán.",
    images: ["/logo.webp"],
    creator: "@lulesmarket",
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
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="es"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        <OrganizationSchema
          name="Lules Market"
          description="Plataforma de comercio local en Lules, Tucumán. Conectamos comercios con clientes de la zona."
          url={env.NEXT_PUBLIC_APP_URL}
          logo={`${env.NEXT_PUBLIC_APP_URL}/logo.webp`}
        />
        <WebSiteSchema
          name="Lules Market"
          url={env.NEXT_PUBLIC_APP_URL}
          searchUrl={`${env.NEXT_PUBLIC_APP_URL}/explorar/productos?search={search_term_string}`}
        />
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="mx-auto font-sans antialiased">
        <NuqsAdapter>
          <RootProviders>{children}</RootProviders>
          <Toaster />
          <Analytics />
        </NuqsAdapter>
      </body>
    </html>
  );
}
