import { createAuthClient } from "better-auth/react";
import { env } from "@/env";
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  forgetPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
} = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.BETTER_AUTH_URL as string,
});
