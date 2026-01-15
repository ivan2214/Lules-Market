"use client";

import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { type TypeExplorer, useSearchUrl } from "@/shared/hooks/use-search-url";
import type { BusinessDto } from "@/shared/utils/dto";

type BusinessesPillsProps = {
  businesses: BusinessDto[];
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
        <Link href={createUrl({ businessId: undefined }) as Route}>Todo</Link>
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
            <Link href={createUrl({ businessId: business.id }) as Route}>
              {business.name}
            </Link>
          </Badge>
        );
      })}
    </div>
  );
};
