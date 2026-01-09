"use client";

import type { User } from "better-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { authClient } from "@/lib/auth/auth-client";
import { HasRole } from "@/shared/components/acccess/has-role";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export function NavUser({ user }: { user: User }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={pathsConfig.dashboard.account.root}>
            <DropdownMenuItem>Account</DropdownMenuItem>
          </Link>
          <Link href={pathsConfig.dashboard.account.security}>
            <DropdownMenuItem>Security</DropdownMenuItem>
          </Link>
          <HasRole role="admin">
            <Link href={pathsConfig.admin.root}>
              <DropdownMenuItem>Admin</DropdownMenuItem>
            </Link>
          </HasRole>
          <Link href={pathsConfig.dashboard.account.preferences}>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut();
            router.refresh();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
