import {
  customSessionClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env/client";
import type { auth } from ".";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    twoFactorClient(),
    customSessionClient<typeof auth>(), // Este plugin infiere los tipos del servidor
  ],
});
