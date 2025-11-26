import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import {
  PostsGrid,
  PostsGridSkeleton,
} from "@/app/(public)/explorar/posts/components/posts-grid";
import { listAllPosts } from "@/app/data/post/post.dal";
import { Button } from "../ui/button";

export async function RecentPosts() {
  const { posts } = await listAllPosts({
    page: 1,
    limit: 6,
    sort: "date_desc",
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
      <Suspense fallback={<PostsGridSkeleton />}>
        <PostsGrid posts={posts} />
      </Suspense>
    </section>
  );
}

export function RecentPostsSkeleton() {
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
      <PostsGridSkeleton />
    </section>
  );
}
