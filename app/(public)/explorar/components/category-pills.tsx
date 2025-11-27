"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { createSearchUrl, type TypeExplorer } from "@/lib/utils";

type CategoryPillsProps = {
  categories: Category[];
  typeExplorer: TypeExplorer;
};

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  typeExplorer,
}) => {
  const params = useSearchParams();
  const currentParams: {
    search?: string;
    category?: string;
    page?: string;
    businessId?: string;
    limit?: string;
    sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
    minRating?: string;
  } = {
    search: params.get("search") ?? undefined,
    category: params.get("category") ?? undefined,
    page: params.get("page") ?? undefined,
    businessId: params.get("businessId") ?? undefined,
    sortBy: params.get("sort") as
      | "price_asc"
      | "price_desc"
      | "name_asc"
      | "name_desc"
      | undefined,
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={
            currentParams.category?.toLowerCase() ===
            category.value.toLowerCase()
              ? "default"
              : "outline"
          }
          className="cursor-pointer px-4 py-2"
          asChild
        >
          <Link
            href={createSearchUrl({
              currentParams,
              updates: { category: category.value },
              typeExplorer,
            })}
          >
            {category.value}
          </Link>
        </Badge>
      ))}
    </div>
  );
};
