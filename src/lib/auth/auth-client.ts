import {
  adminClient,
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env/client";
import type { auth } from ".";
import { ac, allRoles } from "./roles";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: allRoles,
    }),
    twoFactorClient(),
  ],
});
