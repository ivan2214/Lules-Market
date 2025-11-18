"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/lib/constants";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export const MobileMenu = ({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex flex-col gap-4 py-4">
          <nav className="mt-10 flex flex-col gap-1">
            {navigation.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>

          <Separator orientation="horizontal" className="my-2" />

          {!isLoggedIn && (
            <div className="w-full px-10">
              <Button onClick={() => setOpen(false)} asChild className="w-full">
                <Link href="/para-comercios">Para comercios</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
