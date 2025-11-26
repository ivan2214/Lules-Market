"use client";

import { useEffect } from "react";
import { trackProductView } from "@/app/actions/analytics-actions";

export function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackProductView(productId); // se ejecuta solo en el cliente
  }, [productId]);

  return null;
}
