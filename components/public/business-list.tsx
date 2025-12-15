"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { BusinessCard } from "./business-card";

export const BusinessList = () => {
  const { data: featuredBusinesses } = useSuspenseQuery(
    orpc.business.featuredBusinesses.queryOptions(),
  );
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredBusinesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};
