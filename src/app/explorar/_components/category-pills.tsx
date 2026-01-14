"use client";

import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/db/types";
import { Badge } from "@/shared/components/ui/badge";
import { type TypeExplorer, useSearchUrl } from "@/shared/hooks/use-search-url";

type CategoryPillsProps = {
  categories: Category[];
  typeExplorer: TypeExplorer;
  category?: string;
};

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  typeExplorer,
  category,
}) => {
  const params = useSearchParams();
  const currentParams: Record<string, string | undefined> = {
    search: params.get("search") ?? undefined,
    page: params.get("page") ?? undefined,
    limit: params.get("limit") ?? undefined,
    sortBy: params.get("sortBy") ?? undefined,
    businessId: params.get("businessId") ?? undefined,
    category: params.get("category") ?? undefined,
  };

  const { createUrl } = useSearchUrl({ currentParams, typeExplorer });

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Badge variant="outline" className="cursor-pointer px-4 py-2" asChild>
        <Link href={createUrl({ category: undefined }) as Route}>Todo</Link>
      </Badge>
      {categories.map((cat) => {
        const isActive = category?.toLowerCase() === cat.value.toLowerCase();
        return (
          <Badge
            key={cat.id}
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer px-4 py-2"
            asChild
          >
            <Link href={createUrl({ category: cat.value }) as Route}>
              {cat.value}
            </Link>
          </Badge>
        );
      })}
    </div>
  );
};
