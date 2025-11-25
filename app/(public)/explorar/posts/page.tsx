import { Suspense } from "react";
import { getPublicPosts } from "@/app/actions/public-actions";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
import { SearchAndFilters } from "../components/search-and-filters";
import { PostsGrid, PostsGridSkeleton } from "./components/posts-grid";

type SearchParams = {
  search?: string;
  page?: string;
  limit?: string;
  sortBy?: "date_asc" | "date_desc";
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const { limit, page, search, sortBy } = (await searchParams) || {};

  const { posts, total } = await getPublicPosts({
    search,
    sortBy,
    limit: limit ? parseInt(limit, 10) : undefined,
    page: page ? parseInt(page, 10) : undefined,
  });

  return (
    <main className="container mx-auto w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-4xl">Explorar Publicaciones</h1>
        <p className="text-lg text-muted-foreground">
          Descubre lo que está pasando en tu comunidad
        </p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters typeExplorer="posts" params={await searchParams} />

      {/* Results Count */}
      <p className="mb-4 text-muted-foreground text-sm">
        Mostrando {posts.length} de {total} publicaciones
      </p>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <Suspense fallback={<PostsGridSkeleton />}>
          <PostsGrid posts={posts} />
        </Suspense>
      ) : (
        <EmptyStateSearch
          title="No se encontraron publicaciones"
          description="Por favor, intenta con otros términos de búsqueda."
          typeExplorer="posts"
        />
      )}
    </main>
  );
}
