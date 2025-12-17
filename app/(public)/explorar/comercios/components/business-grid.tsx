import { Skeleton } from "@/components/ui/skeleton";
import type { BusinessWithRelations } from "@/db/types";
import { BusinessCard } from "./business-card";

type BusinessGridProps = {
  businesses: BusinessWithRelations[];
};

export const BusinessGrid: React.FC<BusinessGridProps> = ({ businesses }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};

export const BusinessGridSkeleton: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <BusinessCardSkeleton key={index.toString()} />
      ))}
    </div>
  );
};

const BusinessCardSkeleton: React.FC = () => {
  return <Skeleton className="h-[200px] w-full" />;
};
