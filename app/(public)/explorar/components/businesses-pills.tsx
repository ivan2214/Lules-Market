"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Business } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { createSearchUrl, type TypeExplorer } from "@/lib/utils";

type BusinessessProps = {
  businesses: Business[];
  typeExplorer: TypeExplorer;
  businessId?: string;
};

export const BusinessesPills: React.FC<BusinessessProps> = ({
  businesses,
  typeExplorer,
  businessId,
}) => {
  const params = useSearchParams();
  const currentParams: {
    search?: string;
    business?: string;
    page?: string;
    businessId?: string;
    limit?: string;
    sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
    minRating?: string;
  } = {
    search: params.get("search") ?? undefined,
    business: params.get("business") ?? undefined,
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
      {businesses.map((business) => (
        <Badge
          key={business.id}
          variant={
            businessId === business.id.toLowerCase() ? "default" : "outline"
          }
          className="cursor-pointer px-4 py-2"
          asChild
        >
          <Link
            href={createSearchUrl({
              currentParams,
              updates: { businessId: business.id },
              typeExplorer,
            })}
          >
            {business.name}
          </Link>
        </Badge>
      ))}
    </div>
  );
};
