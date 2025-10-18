import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import type React from "react";
import "./globals.css";
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
  title: "Comercios Locales - Tu vitrina digital",
  description:
    "Plataforma para pequeños comercios locales. Publica tus productos y servicios, aumenta tu visibilidad y atrae más clientes.",
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
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="mx-auto font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
