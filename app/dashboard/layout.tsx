import { redirect } from "next/navigation";
import type React from "react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import prisma from "@/lib/prisma";
import { requireUser } from "../data/user/require-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  if (!session) {
    redirect("/auth/signin");
  }

  const existsUser = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      business: {
        include: {
          logo: true,
          coverImage: true,
        },
      },
    },
  });

  if (!existsUser) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader user={existsUser} />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
