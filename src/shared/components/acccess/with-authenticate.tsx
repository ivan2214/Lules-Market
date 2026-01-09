import type { Route } from "next";
import { authenticate } from "@/lib/auth/authenticate";
import type { Permissions, Role } from "@/lib/auth/roles";

type LayoutOrPageComponent<Params> = React.ComponentType<Params>;

export function withAuthenticate<Params extends object>(
  Component: LayoutOrPageComponent<Params>,
  args?: {
    permissions?: Permissions;
    role?: Role;
    redirect?: Route;
  },
) {
  return async function AuthenticateServerComponentWrapper(params: Params) {
    try {
      const response = await authenticate(args);

      if (!response.user) {
        throw new Error("User not authenticated");
      }

      return <Component user={response.user} {...params} />;
      // biome-ignore lint/suspicious/noExplicitAny: <necessary>
    } catch (error: any) {
      if (
        error?.message === "NEXT_REDIRECT" ||
        error?.digest?.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
      console.log("error", error);
      console.error(error);
    }
  };
}
