"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

import { orpcTanstack } from "@/lib/orpc";

export function BusinessViewTracker({ businessId }: { businessId: string }) {
  const { mutate } = useMutation(
    orpcTanstack.business.trackBusinessView.mutationOptions(),
  );

  useEffect(() => {
    mutate({ businessId });
  }, [businessId]);

  return null;
}
