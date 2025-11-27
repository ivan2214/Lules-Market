"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AdminDTO } from "@/app/data/admin/admin.dto";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { Button } from "../ui/button";

type AdminMenuProps = {
  admin: AdminDTO;
};

export const AdminMenu: React.FC<AdminMenuProps> = ({ admin }) => {
  const router = useRouter();
  const initials = admin.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  console.log("Permisos", admin.permissions);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{admin.user.name}</DropdownMenuLabel>
        <DropdownMenuLabel className="font-extralight text-xs">
          {admin.user.email}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="flex flex-col items-start gap-2">
          Permisos:
          <span className="font-extralight text-xs">
            {admin.permissions.map((permission) => permission).join(", ")}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
