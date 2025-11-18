import Image from "next/image";
import Link from "next/link";
import { DesktopMenu } from "./desktop-menu";
import { NavigationWrapper } from "./navigation-wrapper";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/95">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="w-24 lg:w-32">
            <Image
              src="/logo-tp.png"
              width={48}
              height={48}
              className="h-full w-full object-cover"
              alt="Logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <DesktopMenu />
        </div>

        {/* Right Actions */}
        <NavigationWrapper />
      </div>
    </header>
  );
}
