"use client";

import { useEffect } from "react";
import { trackBusinessView } from "@/app/actions/analytics-actions";

export function BusinessViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackBusinessView(productId); // se ejecuta solo en el cliente
  }, [productId]);

  return null;
}
