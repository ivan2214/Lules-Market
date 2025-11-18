import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import prisma from "@/lib/prisma";
import { PublicPostCard } from "../public/public-post-card";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";

export async function RecentPosts() {
  // ✅ Mark as dynamic
  await connection();

  const recentPosts = await prisma.post.findMany({
    where: { content: { not: "" } },
    include: {
      author: { include: { avatar: true } },
      answers: { include: { author: { include: { avatar: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-3xl">Posts Recientes</h2>
          <p className="text-muted-foreground">
            La comunidad pregunta y responde
          </p>
        </div>
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/explorar/posts">
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentPosts.map((post) => (
          <PublicPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

export function PostsSkeletons() {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="mb-2 h-6 w-full animate-pulse rounded bg-gray-200" />
              <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
