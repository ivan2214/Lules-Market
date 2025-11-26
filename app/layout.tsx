import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import type React from "react";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="mx-auto font-sans antialiased">
        {children}
        {/* {process.env.NODE_ENV === "development" && <DevTools />} */}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
