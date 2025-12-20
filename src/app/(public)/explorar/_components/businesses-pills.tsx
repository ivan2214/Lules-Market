"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Business } from "@/db/types";
import { Badge } from "@/shared/components/ui/badge";
import { type TypeExplorer, useSearchUrl } from "@/shared/hooks/use-search-url";

type BusinessesPillsProps = {
  businesses: Business[];
  typeExplorer: TypeExplorer;
  businessId?: string;
};

export const BusinessesPills: React.FC<BusinessesPillsProps> = ({
  businesses,
  typeExplorer,
  businessId,
}) => {
  const params = useSearchParams();
  const currentParams: Record<string, string | undefined> = {
    search: params.get("search") ?? undefined,
    page: params.get("page") ?? undefined,
    limit: params.get("limit") ?? undefined,
    sortBy: params.get("sortBy") ?? undefined,
    businessId: params.get("businessId") ?? undefined,
  };

  const { createUrl } = useSearchUrl({ currentParams, typeExplorer });

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Badge variant="outline" className="cursor-pointer px-4 py-2" asChild>
        <Link href={createUrl({ businessId: undefined })}>Todo</Link>
      </Badge>
      {businesses.map((business) => {
        const isActive = businessId === business.id.toLowerCase();
        return (
          <Badge
            key={business.id}
            variant={isActive ? "default" : "outline"}
            className="cursor-pointer px-4 py-2"
            asChild
          >
            <Link href={createUrl({ businessId: business.id })}>
              {business.name}
            </Link>
          </Badge>
        );
      })}
    </div>
  );
};
