import { Suspense } from "react";
import { getPublicPosts } from "@/app/actions/public-actions";
import EmptyStateSearch from "@/components/empty-state/empty-state-search";
import { LimitSelector } from "@/components/shared/limit-selector";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { SearchAndFilters } from "../components/search-and-filters";
import { CreatePostDialog } from "./components/create-post-dialog";
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

  const currentPage = page ? parseInt(page, 10) : 1;
  const currentLimit = limit ? parseInt(limit, 10) : 12;

  const { posts, total } = await getPublicPosts({
    search,
    sortBy,
    limit: currentLimit,
    page: currentPage,
  });

  const totalPages = Math.ceil(total / currentLimit);

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 font-bold text-4xl">Explorar Publicaciones</h1>
          <p className="text-lg text-muted-foreground">
            Descubre lo que está pasando en tu comunidad
          </p>
        </div>
        <CreatePostDialog />
      </div>

      {/* Search and Filters */}
      <SearchAndFilters typeExplorer="posts" params={await searchParams} />

      {/* Results Count and Limit Selector */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando {posts.length} de {total} publicaciones
        </p>
        <LimitSelector
          currentLimit={currentLimit}
          total={total}
          currentPage={currentPage}
        />
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <>
          <Suspense
            key={JSON.stringify(await searchParams)}
            fallback={<PostsGridSkeleton />}
          >
            <PostsGrid posts={posts} />
          </Suspense>
          <div className="mt-8 flex justify-center">
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>
        </>
      ) : (
        <EmptyStateSearch
          title="No se encontraron publicaciones"
          description="Por favor, intenta con otros términos de búsqueda."
          typeExplorer="posts"
        />
      )}
    </>
  );
}
