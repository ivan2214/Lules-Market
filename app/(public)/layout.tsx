import type React from "react";
import { Navigation } from "@/components/navigation";
import { PublicFooter } from "@/components/public/footer";

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
