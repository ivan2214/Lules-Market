import type React from "react";
import { Suspense } from "react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";
import { PublicNavbarSkeleton } from "@/components/skeletons/navbar-skeleton";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen flex-col">
      <Suspense fallback={<PublicNavbarSkeleton />}>
        <PublicNavbar />
      </Suspense>
      {children}
      <PublicFooter />
    </div>
  );
}
