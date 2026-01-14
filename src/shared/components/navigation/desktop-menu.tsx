"use client";

import type { LucideProps } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";
import { navigationWithTitles } from "@/shared/constants/navigation-with-titles";
import { useIsMobile } from "@/shared/hooks/use-mobile";

export function DesktopMenu() {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList>
        {Object.entries(navigationWithTitles).map(([title, items]) => (
          <NavigationMenuItem key={title} className="hidden md:block">
            <NavigationMenuTrigger className="capitalize">
              {title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {items.map((item) => (
                  <ListItem
                    key={item.name}
                    title={item.name}
                    href={item.href}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: Route;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="flex flex-col gap-2">
          <div
            className={cn(
              "font-medium text-sm leading-none",
              Icon && "flex flex-row items-center gap-2",
            )}
          >
            {Icon && <Icon className="size-4" />}
            {title}
          </div>
          <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
