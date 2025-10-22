"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const routes: {
  label: string;
  href: string;
}[] = [
  {
    label: "Inicio",
    href: "/",
  },
  {
    label: "Explorar",
    href: "/explorar",
  },
  {
    label: "Como funciona",
    href: "/como-funciona",
  },
  {
    label: "Planes",
    href: "/planes",
  },
  {
    label: "Privacidad",
    href: "/privacidad",
  },
  {
    label: "Terminos y condiciones",
    href: "/terminos-y-condiciones",
  },
];

export const PublicMenuMobile = ({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Enlaces</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 px-10">
          {routes.map((route) => (
            <Link onClick={handleClose} key={route.href} href={route.href}>
              {route.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <Button onClick={handleClose} asChild>
              <Link href="/para-comercios">Para comercios</Link>
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
