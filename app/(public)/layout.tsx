import type React from "react";
import { PublicFooter } from "@/app/(public)/_components/footer";
import { Navigation } from "@/app/shared/components/navigation";

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
