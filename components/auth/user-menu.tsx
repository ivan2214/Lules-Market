"use client";
import { LayoutDashboard, LogOut, Settings, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BusinessDTO } from "@/app/data/business/business.dto";
import { signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface UserMenuProps {
  business: BusinessDTO;
}

export const UserMenu: React.FC<UserMenuProps> = ({ business }) => {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const initials = business?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border"
        >
          <Avatar>
            <AvatarImage
              src={business.logo?.url || ""}
              alt={business.name || ""}
            />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={business.logo?.url || ""}
              alt={business.name || ""}
            />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">
                {business.name}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {business.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Mi panel
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/comercios/${business.id}`} className="cursor-pointer">
            <Store className="mr-2 h-4 w-4" />
            Perfil publico
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </DropdownMenuItem>
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
