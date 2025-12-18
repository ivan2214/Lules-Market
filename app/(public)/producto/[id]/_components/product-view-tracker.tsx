"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

import { orpcTanstack } from "@/lib/orpc";

export function ProductViewTracker({ productId }: { productId: string }) {
  const { mutate } = useMutation(
    orpcTanstack.products.trackProductView.mutationOptions(),
  );

  useEffect(() => {
    mutate({ productId });
  }, [productId]);

  return null;
}
