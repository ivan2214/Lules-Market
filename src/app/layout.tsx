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
    default: "Lules Market - Productos y Comercios en Lules, Tucumán",
    template: "%s | Lules Market",
  },

  description:
    "Plataforma de comercio local en Lules, Tucumán. Descubrí productos, comercios y servicios de tu zona. Conectamos vecinos con negocios locales.",

  verification: {
    google: "8NkhaNOxnwiM0xa44M867a1R-phEJqisP8XMcJYaQfE",
  },

  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Lules Market",
  },

  twitter: {
    card: "summary_large_image",
    creator: "@bongiovanniDev",
  },

  robots: {
    index: true,
    follow: true,
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
