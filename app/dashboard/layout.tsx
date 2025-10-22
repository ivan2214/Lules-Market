import { redirect } from "next/navigation";
import type React from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { requireAuth } from "@/lib/actions/auth-actions";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  if (!session) {
    redirect("/auth/signin");
  }

  const existsUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!existsUser) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
