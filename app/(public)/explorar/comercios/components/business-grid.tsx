import type { BusinessDTO } from "@/app/data/business/business.dto";
import { Skeleton } from "@/components/ui/skeleton";
import { BusinessCard } from "./business-card";

type BusinessGridProps = {
  businesses: BusinessDTO[];
};

export const BusinessGrid: React.FC<BusinessGridProps> = ({ businesses }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
