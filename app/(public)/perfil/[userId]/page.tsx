import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostsGrid } from "@/app/(public)/explorar/posts/components/posts-grid";
import { getPublicProfile } from "@/app/data/user/user.dal";
import { ProfileHeader } from "./components/profile-header";

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
    description: `Ver las publicaciones de ${profile.name} en Lules Market.`,
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
        postCount={profile.posts.length}
      />

      <div className="space-y-6">
        <h2 className="font-semibold text-xl">Publicaciones</h2>
        {profile.posts.length > 0 ? (
          <PostsGrid posts={profile.posts} />
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <p>Este usuario aún no ha realizado publicaciones.</p>
          </div>
        )}
      </div>
    </div>
  );
}
