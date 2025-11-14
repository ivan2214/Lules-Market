"use client";
import { useState } from "react";
import type { Category } from "@/app/generated/prisma";
import { Badge } from "@/components/ui/badge";

type CategoryPillsProps = {
  categories: Category[];
};

export const CategoryPills: React.FC<CategoryPillsProps> = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge
          key={category.id}
          variant={
            selectedCategory.toLowerCase() === category.value.toLowerCase()
              ? "default"
              : "outline"
          }
          className="cursor-pointer px-4 py-2"
          onClick={() => setSelectedCategory(category.value)}
        >
          {category.label}
        </Badge>
      ))}
    </div>
  );
};
