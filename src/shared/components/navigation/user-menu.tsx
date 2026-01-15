"use client";
import { LayoutDashboard, LogOut, StoreIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/app/dashboard/_constants";
import { signOut } from "@/lib/auth/auth-client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface UserMenuProps {
  name: string;
  avatar?: string | null;
  email: string;
  isBusiness: boolean;
  businessId?: string;
  isAdmin: boolean;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  avatar,
  name,
  email,
  isBusiness,
  businessId,
  isAdmin,
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border"
        >
          <Avatar>
            <AvatarImage src={avatar || ""} alt={name || ""} />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={avatar || ""} alt={name || ""} />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">{name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator />

        {businessId && isBusiness && (
          <DropdownMenuItem asChild>
            <Link
              onClick={() => setOpen(false)}
              href={`/comercio/${businessId}`}
              className="flex cursor-pointer items-center gap-2"
            >
              <StoreIcon className="mr-2 h-4 w-4" />
              Perfil publico
            </Link>
          </DropdownMenuItem>
        )}

        {isBusiness &&
          navigation.map((item) => (
            <DropdownMenuItem asChild key={item.href}>
              <Link
                onClick={() => setOpen(false)}
                href={item.href}
                className="cursor-pointer"
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                {item.name}
              </Link>
            </DropdownMenuItem>
          ))}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link
              onClick={() => setOpen(false)}
              href="/admin"
              className="cursor-pointer"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Panel de administrador
            </Link>
          </DropdownMenuItem>
        )}

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
