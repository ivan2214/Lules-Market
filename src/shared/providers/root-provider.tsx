"use client";

import { ThemeProvider } from "next-themes";
import type { authClient } from "@/lib/auth/auth-client";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { ReactQueryProvider } from "./react-query-provider";

type AuthSession = typeof authClient.$Infer.Session;

export function RootProviders({
  children,
  auth,
}: React.PropsWithChildren<{
  auth: AuthSession | null;
}>) {
  return (
    <ReactQueryProvider>
      <AuthProvider auth={auth}>
        <ThemeProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
          defaultTheme="system"
          enableColorScheme={false}
        >
          {children}
        </ThemeProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
