"use client";

import { Menu, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { UserDTO } from "@/app/data/user/user.dto";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserMenu } from "../auth/user-menu";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardHeader({ user }: { user: UserDTO }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
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
          <DashboardSidebar onClose={() => handleOpenChange(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <UserMenu user={user} />
    </header>
  );
}
