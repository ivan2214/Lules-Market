"use client";

import { ThemeProvider } from "next-themes";
import { ReactQueryProvider } from "./react-query-provider";

export function RootProviders({ children }: React.PropsWithChildren) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        enableSystem
        disableTransitionOnChange
        defaultTheme="light"
        enableColorScheme={false}
      >
        {children}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
