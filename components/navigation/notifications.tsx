import { Bell } from "lucide-react";
import type { Notification } from "@/app/generated/prisma";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type NotificationsProps = {
  notifications?: Notification[] | null;
};

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="-right-1 -top-1 absolute h-5 w-5 rounded-full p-0 text-xs">
            {notifications?.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications && notifications?.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id}>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">{notification.message}</p>
                <p className="text-muted-foreground text-xs">
                  {notification.createdAt.toLocaleString()}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>No tienes notificaciones</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
