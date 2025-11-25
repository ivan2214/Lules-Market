"use client";
import { Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "./empty-state";

export default function EmptyStateSearch({
  title,
  description,
  typeExplorer,
}: {
  title: string;
  description: string;
  typeExplorer: "productos" | "comercios" | "posts";
}) {
  const router = useRouter();
  return (
    <EmptyState
      title={title}
      description={description}
      icons={[Package]}
      action={{
        label: "Limpiar filtros",
        onClick: () => {
          router.push(`/explorar/${typeExplorer}`);
        },
      }}
    />
  );
}
