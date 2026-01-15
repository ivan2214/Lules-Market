"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/eden";

export function useSession() {
  const { data, isLoading, isPending, error, isError } = useQuery({
    queryKey: ["session"],
    queryFn: () => api.actions["get-session"].get(),
  });

  if (error || !data || isError) {
    return {
      data: null,
      isLoading,
      isPending,
    };
  }

  console.log({
    data,
  });

  return {
    data: data.data,
    isLoading,
    isPending,
  };
}
