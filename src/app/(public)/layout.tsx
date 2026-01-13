import type React from "react";
import { PublicFooter } from "@/app/(public)/_components/footer";
import { Navigation } from "@/shared/components/navigation";

export const dynamic = "force-dynamic";
/* revalidar cada 30 minutos */
export const revalidate = 60 * 30;

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen flex-col">
      <Navigation />

      {children}
      <PublicFooter />
    </div>
  );
}
