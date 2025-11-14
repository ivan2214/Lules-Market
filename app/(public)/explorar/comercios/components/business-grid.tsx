import type { BusinessDTO } from "@/app/data/business/business.dto";
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
