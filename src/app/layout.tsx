import "@/orpc/server"; // prerendering for ssr
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import type React from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { getSession } from "@/orpc/actions/user/get-session";
import { Toaster } from "@/shared/components/ui/sonner";
import { RootProviders } from "@/shared/providers/root-provider";

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
  title: "Lules Market - Tu vitrina digital",
  description:
    "Plataforma para comercios locales. Publica tus productos y servicios, aumenta tu visibilidad y atrae más clientes.",
  keywords: [
    "comercios locales",
    "negocios",
    "productos",
    "servicios",
    "vitrina digital",
  ],
  verification: {
    google: "8NkhaNOxnwiM0xa44M867a1R-phEJqisP8XMcJYaQfE",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [_, auth] = await getSession();

  return (
    <html
      lang="es"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="mx-auto font-sans antialiased">
        <RootProviders auth={auth ?? null}>{children}</RootProviders>
        {/* {process.env.NODE_ENV === "development" && <DevTools />} */}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
