import type React from "react";
import { Suspense } from "react";
import { PublicFooter } from "@/components/public/footer";
import { PublicNavbar } from "@/components/public/navbar";

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

function PublicNavbarSkeleton() {
  return (
    <div className="flex h-14 w-full items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 rounded bg-muted" />
        <div className="h-8 w-24 rounded bg-muted" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 rounded bg-muted" />
        <div className="h-8 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}
