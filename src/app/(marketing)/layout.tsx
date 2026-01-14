import type React from "react";
import { Footer } from "@/shared/components/footer";
import { Navigation } from "@/shared/components/navigation";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto flex min-h-screen flex-col">
      <Navigation />
      <main className="container mx-auto lg:p-16">{children}</main>
      <Footer />
    </section>
  );
}
