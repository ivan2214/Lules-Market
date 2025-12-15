"use client";
import type { BusinessWithRelations } from "@/db";
import { BusinessCard } from "./business-card";

export const BusinessList = ({
  featuredBusinesses,
}: {
  featuredBusinesses: BusinessWithRelations[];
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredBusinesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};
