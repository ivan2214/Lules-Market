import type React from "react";
import { Footer } from "@/shared/components/footer";
import { Navigation } from "@/shared/components/navigation";

export const dynamic = "force-dynamic";
/* revalidar cada 30 minutos en segundos*/
export const revalidate = 1800;

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen flex-col">
      <Navigation />
      {children}
      <Footer />
    </main>
  );
}
