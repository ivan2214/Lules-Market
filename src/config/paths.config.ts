import type { Route } from "next";
import { z } from "zod";

const PathsSchema = z.object({
  auth: z.object({
    signIn: z.custom<Route>(),
    signUp: z.custom<Route>(),
    forgotPassword: z.custom<Route>(),
    resetPassword: z.custom<Route>(),
    twoFactor: z.custom<Route>(),
  }),
  app: z.object({
    home: z.custom<Route>(),
    account: z.custom<Route>(),
    security: z.custom<Route>(),
    preferences: z.custom<Route>(),
  }),
  admin: z.object({
    root: z.custom<Route>(),
    users: z.custom<Route>(),
  }),
});

const pathsConfig = PathsSchema.parse({
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    twoFactor: "/auth/two-factor",
  },
  app: {
    home: "/home",
    account: "/home/account",
    security: "/home/security",
    preferences: "/home/preferences",
  },
  admin: {
    root: "/admin",
    users: "/admin/users",
  },
} satisfies z.infer<typeof PathsSchema>);

export default pathsConfig;
