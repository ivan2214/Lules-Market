"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { UserRole } from "@/db/types";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/components/ui/command";
import { useAccessControl } from "@/shared/hooks/use-access-control";

export function SearchCommandDialog({
  children,
  commandsData,
  userRole,
}: {
  children: (props: {
    open: boolean;
    setOpen: (open: boolean) => void;
  }) => React.ReactNode;
  commandsData: Record<
    string,
    Array<{
      title: string;
      url: Route;
      icon: React.ElementType;
      role?: UserRole;
      disabled?: boolean;
    }>
  >;
  userRole: UserRole;
}) {
  const { hasRole } = useAccessControl(userRole);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredData = Object.entries(commandsData).filter(([, value]) => {
    return value.every((item) => {
      if (item.role && !hasRole(item.role)) {
        return false;
      }
      return true;
    });
  });

  return (
    <Command>
      {children({
        open,
        setOpen,
      })}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredData.map(([key, value], index) => {
            return (
              <React.Fragment key={key}>
                {index !== 0 && <CommandSeparator />}
                <CommandGroup heading={key}>
                  {value.map((item) => {
                    if (item.role && !hasRole(item.role)) {
                      return null;
                    }
                    return (
                      <CommandItem
                        key={item.title}
                        disabled={item.disabled}
                        onSelect={() => {
                          router.push(item.url);
                          setOpen(false);
                        }}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </React.Fragment>
            );
          })}
        </CommandList>
      </CommandDialog>
    </Command>
  );
}
