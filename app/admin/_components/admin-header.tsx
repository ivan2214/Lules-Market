"use client";

import { Menu, Store } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { Button } from "@/app/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/app/shared/components/ui/sheet";
import type { AdminWithRelations } from "@/db/types";
import { AdminMenu } from "./admin-menu";
import { AdminSidebar } from "./admin-sidebar";
import { AdminMenuSkeleton } from "./skeletons/admin-menu-skeleton";

export function AdminHeader({ admin }: { admin: AdminWithRelations }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 py-2 md:px-6">
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="px-6 py-4 font-bold text-2xl">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <Store className="h-6 w-6" />
              <span>Mi Comercio</span>
            </Link>
          </SheetTitle>
          <AdminSidebar onClose={() => handleOpenChange(false)} />
        </SheetContent>
      </Sheet>

      <h2 className="font-bold text-lg lg:text-2xl">Panel de Admin</h2>

      <div className="flex-1" />
      <Suspense fallback={<AdminMenuSkeleton />}>
        <AdminMenu admin={admin} />
      </Suspense>
    </header>
  );
}
