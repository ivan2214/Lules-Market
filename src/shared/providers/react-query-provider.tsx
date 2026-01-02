"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { createQueryClient } from "@/lib/query/client";

export function ReactQueryProvider(props: React.PropsWithChildren) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}
