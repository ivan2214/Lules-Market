import type React from "react";
import { PublicNavbar } from "@/components/public/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen flex-col">
      <PublicNavbar />
      {children}
    </div>
  );
}
