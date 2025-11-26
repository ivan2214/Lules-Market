import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostsGrid } from "@/app/(public)/explorar/posts/components/posts-grid";
import { getPublicProfile } from "@/app/data/user/user.dal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "./components/profile-header";
import { ReviewsList } from "./components/reviews-list";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const profile = await getPublicProfile(userId);

  if (!profile) {
    return {
      title: "Perfil no encontrado",
    };
  }

  return {
    title: `Perfil de ${profile.name} | Lules Market`,
    description: `Ver las publicaciones y reseñas de ${profile.name} en Lules Market.`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;
  const profile = await getPublicProfile(userId);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader
        name={profile.name}
        avatarUrl={profile.avatar?.url}
        createdAt={profile.createdAt}
        postCount={profile.posts?.length || 0}
      />

      <Tabs defaultValue="posts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="posts">
            Publicaciones ({profile.posts?.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reseñas ({profile.reviews?.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {profile.posts && profile.posts.length > 0 ? (
            <PostsGrid posts={profile.posts} />
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>Este usuario aún no ha realizado publicaciones.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {profile.reviews && profile.reviews.length > 0 ? (
            <ReviewsList reviews={profile.reviews} />
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <p>Este usuario aún no ha escrito reseñas.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
