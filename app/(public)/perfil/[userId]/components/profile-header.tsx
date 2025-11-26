import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileHeaderProps {
  name: string;
  avatarUrl?: string | null;
  createdAt: Date;
  postCount: number;
}

export function ProfileHeader({
  name,
  avatarUrl,
  createdAt,
  postCount,
}: ProfileHeaderProps) {
  return (
    <Card className="mb-8 overflow-hidden p-0">
      <div className="h-32 bg-gradient-to-r from-primary/40 to-primary/20" />
      <CardContent className="relative px-6 pb-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-6">
          <div className="-mt-12 relative">
            <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
              <AvatarImage src={avatarUrl || undefined} alt={name} />
              <AvatarFallback className="text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mt-4 flex-1 text-center sm:mt-0 sm:pb-2 sm:text-left">
            <h1 className="font-bold text-2xl">{name}</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-muted-foreground text-sm sm:justify-start">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>
                  Se unió en{" "}
                  {format(createdAt, "MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
              <div>
                <span className="font-medium text-foreground">{postCount}</span>{" "}
                publicaciones
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
