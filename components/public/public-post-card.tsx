import { MessageSquare } from "lucide-react";
import type { PostDTO } from "@/app/data/post/post.dto";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface PublicPostCardProps {
  post: PostDTO;
}

export const PublicPostCard: React.FC<PublicPostCardProps> = ({ post }) => {
  return (
    <Card key={post.id} className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={post.author?.avatar?.url || "/placeholder.svg"}
              alt={post.author?.name}
            />
            <AvatarFallback>{post.author?.name?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{post.author?.name || "Anónimo"}</p>
            <p className="text-muted-foreground text-xs">
              {post.createdAt.toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm">{post.content}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full gap-2">
          <MessageSquare className="h-4 w-4" />
          {post.answers?.length} respuestas
        </Button>
      </CardFooter>
    </Card>
  );
};
