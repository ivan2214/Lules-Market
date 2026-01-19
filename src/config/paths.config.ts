import type { Route } from "next";
import { z } from "zod";

export const PathsSchema = z.object({
  auth: z.object({
    signIn: z.custom<Route>(),
    signUp: z.custom<Route>(),
    forgotPassword: z.custom<Route>(),
    resetPassword: z.custom<Route>(),
    twoFactor: z.custom<Route>(),
  }),

  admin: z.object({
    root: z.custom<Route>(),

    grants: z.custom<Route>(),
    payments: z.custom<Route>(),
    logs: z.custom<Route>(),
    entities: z.custom<Route>(),
    products: z.custom<Route>(),
    plans: z.custom<Route>(),
  }),
  dashboard: z.object({
    root: z.custom<Route>(),
    products: z.custom<Route>(),
    analytics: z.custom<Route>(),

    /*   account: z.object({
      root: z.custom<Route>(),
      security: z.custom<Route>(),
      preferences: z.custom<Route>(),
      settings: z.custom<Route>(),
    }), */
    subscription: z.object({
      root: z.custom<Route>(),
      success: z.custom<Route>(),
    }),
  }),
  business: z.object({
    setup: z.custom<Route>(),
  }),
});

export type Paths = z.infer<typeof PathsSchema>;

const pathsConfig = PathsSchema.parse({
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    twoFactor: "/auth/two-factor",
  },

  admin: {
    root: "/admin",

    grants: "/admin/grants",
    payments: "/admin/payments",
    logs: "/admin/logs",
    entities: "/admin/entities",
    products: "/admin/products",
    plans: "/admin/plans",
  },
  dashboard: {
    root: "/dashboard",
    products: "/dashboard/products",
    analytics: "/dashboard/analytics",
    /*  account: {
      root: "/dashboard/account",
      security: "/dashboard/account/security",
      preferences: "/dashboard/account/preferences",
      settings: "/dashboard/account/settings",
    }, */
    subscription: {
      root: "/dashboard/subscription/success",
      success: "/dashboard/subscription/success",
    },
  },
  business: {
    setup: "/business/setup",
  },
} satisfies z.infer<typeof PathsSchema>);

export default pathsConfig;
