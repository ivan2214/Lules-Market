import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { MessageCircle, User } from "lucide-react";
import Image from "next/image";
import type { PostDTO } from "@/app/data/post/post.dto";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PostsGridProps {
  posts: PostDTO[];
}

export function PostsGrid({ posts }: PostsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostCard({ post }: { post: PostDTO }) {
  const authorName = post.author.name || "Usuario Anónimo";
  const authorAvatar = post.author.avatar?.url;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <Card
      className={cn(
        "flex h-fit flex-col overflow-hidden p-0 transition-all hover:shadow-md",
        post.images && post.images.length > 0 && "h-full",
      )}
    >
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
        <Avatar>
          <AvatarImage src={authorAvatar} alt={authorName} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{authorName}</span>
          <span className="text-muted-foreground text-xs">{timeAgo}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <p className="line-clamp-4 text-sm">{post.content}</p>
        {post.images && post.images.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-md">
            <div className="relative aspect-video w-full">
              <Image
                src={post.images[0].url}
                alt="Imagen del post"
                fill
                className="object-cover"
              />
              {post.images.length > 1 && (
                <div className="absolute right-2 bottom-2 rounded-md bg-black/60 px-2 py-1 text-white text-xs">
                  +{post.images.length - 1}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 gap-1 text-muted-foreground text-sm hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.answers?.length || 0} respuestas</span>
              </Button>
            </DialogTrigger>
            <PostAnswersDialog post={post} />
          </Dialog>
          {post.isQuestion && <Badge variant="secondary">Pregunta</Badge>}
        </div>
      </CardFooter>
    </Card>
  );
}

function PostAnswersDialog({ post }: { post: PostDTO }) {
  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Respuestas</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[60vh] pr-4">
        {post.answers && post.answers.length > 0 ? (
          <div className="space-y-4">
            {post.answers.map((answer) => (
              <div
                key={answer.id}
                className="flex gap-3 border-b pb-4 last:border-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={answer.author.avatar?.url}
                    alt={answer.author.name || "Usuario"}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {answer.author.name || "Usuario Anónimo"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(answer.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="text-sm">{answer.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <MessageCircle className="mb-2 h-8 w-8 opacity-50" />
            <p>No hay respuestas aún.</p>
            <p className="text-sm">¡Sé el primero en responder!</p>
          </div>
        )}
      </ScrollArea>
    </DialogContent>
  );
}

export function PostsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex h-full flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0">
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-4 aspect-video w-full rounded-md" />
          </CardContent>
          <CardFooter className="border-t p-4">
            <Skeleton className="h-4 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
