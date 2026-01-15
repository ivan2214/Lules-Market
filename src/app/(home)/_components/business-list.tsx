import { BusinessCard } from "@/shared/components/business-card";
import type { BusinessDto } from "@/shared/utils/dto";

export const BusinessList = ({
  featuredBusinesses,
}: {
  featuredBusinesses: BusinessDto[];
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredBusinesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};
